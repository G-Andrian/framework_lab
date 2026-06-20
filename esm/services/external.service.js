const sleep = ms =>
  new Promise(resolve =>
    setTimeout(resolve, ms)
  );

export const fetchWithTimeout = async (
  url,
  timeout = 5000
) => {
  const controller =
    new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    timeout
  );

  try {
    return await fetch(url, {
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
};

export const fetchWithRetry = async (
  url,
  retries = 3
) => {
  for (
    let attempt = 0;
    attempt < retries;
    attempt++
  ) {
    try {
      const response =
        await fetchWithTimeout(url);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      return response;
    } catch (error) {
      if (
        attempt === retries - 1
      ) {
        throw error;
      }

      const delay =
        1000 *
        Math.pow(2, attempt);

      await sleep(delay);
    }
  }
};