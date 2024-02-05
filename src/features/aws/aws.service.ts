import { randomUUID } from "crypto";
import * as path from "path";

import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import * as AWS from "aws-sdk";
import {
  ManagedUpload,
  PutObjectRequest,
  DeleteObjectRequest,
  DeleteObjectOutput,
} from "aws-sdk/clients/s3";

import envConfig from "src/config/env.config";
import { errorMessages, fileConstants } from "src/constants";

@Injectable()
export class AwsService {
  private readonly s3: AWS.S3;

  constructor(
    @Inject(envConfig.KEY)
    private config: ConfigType<typeof envConfig>
  ) {
    this.s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  }

  private uploadToS3 = (params: PutObjectRequest) => {
    return new Promise<string>((resolve, reject) =>
      this.s3.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
          reject(err);
        }

        resolve(data.Location);
      })
    );
  };

  private removeFile = async (key: string) => {
    const requestParams: DeleteObjectRequest = {
      Bucket: this.config.aws.bucketName,
      Key: key,
    };

    return new Promise<boolean>((resolve, reject) =>
      this.s3.deleteObject(
        requestParams,
        (err: Error, data: DeleteObjectOutput) => {
          if (err) {
            reject(err);
          }

          resolve(data.DeleteMarker ? data.DeleteMarker : false);
        }
      )
    );
  };

  private getFileName(file: Express.Multer.File) {
    const fileName = fileConstants.heicMimeTypes.includes(file.mimetype)
      ? `${path.parse(file.originalname).name}.jpeg`
      : file.originalname;

    return `${randomUUID()}-${fileName}`;
  }

  private getFileKey(file: Express.Multer.File, folder: string) {
    const fileName = this.getFileName(file);
    return `${folder}${fileName}`;
  }

  private getCommonParams(file: Express.Multer.File) {
    return {
      Bucket: this.config.aws.bucketName,
      ContentType: fileConstants.heicMimeTypes.includes(file.mimetype)
        ? fileConstants.fileJpeg
        : file.mimetype,
    };
  }

  getFileKeyFromUri(fileUri: string) {
    return fileUri.split("/").slice(3).join("/");
  }

  async uploadImage(image: Express.Multer.File, folder: string) {
    const body = image.buffer;

    return this.uploadToS3({
      ...this.getCommonParams(image),
      Body: body,
      Key: this.getFileKey(image, folder),
    });
  }

  async uploadFiles(files: Array<Express.Multer.File>, folder: string) {
    if (!files.length) {
      throw new BadRequestException(errorMessages.noFileSent);
    }

    return Promise.all(
      files.map(async (file) => {
        const body = file.buffer;

        return this.uploadToS3({
          ...this.getCommonParams(file),
          Body: body,
          Key: this.getFileKey(file, folder),
        });
      })
    );
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    const body = file.buffer;

    return this.uploadToS3({
      ...this.getCommonParams(file),
      Body: body,
      Key: this.getFileKey(file, folder),
    });
  }

  async removeFiles(keys: string[]) {
    if (!keys.length) {
      return;
    }

    return Promise.all(keys.map((key) => this.removeFile(key)));
  }

  removeFileByUri(fileUri: string) {
    const key = this.getFileKeyFromUri(fileUri);

    return this.removeFile(key);
  }
}
