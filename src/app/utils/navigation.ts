export const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_APP_URL || '';
};

export const getFullUrl = (path: string) => {
  const baseUrl = getBaseUrl();
  return baseUrl ? `${baseUrl}${path}` : path;
}; 