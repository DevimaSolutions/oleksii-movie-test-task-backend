export const getPaginationData = (
  page: number,
  perPage: number,
  total: number
) => {
  const offset = (Number(page) - 1) * Number(perPage);
  const hasMore = Number(total) > offset + Number(perPage);

  return { offset, hasMore };
};
