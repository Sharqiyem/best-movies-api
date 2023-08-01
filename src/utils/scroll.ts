export const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const scrollPage = async (page) => {
  const bodyHandle = await page.$('body');
  const { height } = await bodyHandle.boundingBox();
  await bodyHandle.dispose();

  // Scroll one viewport at a time, pausing to let content load
  const viewportHeight = page.viewport().height;
  let viewportIncr = 0;
  while (viewportIncr + viewportHeight < height) {
    await page.evaluate((_viewportHeight) => {
      window.scrollBy(0, _viewportHeight);
    }, viewportHeight);
    await timeout(1000);
    viewportIncr = viewportIncr + viewportHeight;
  }

  // Scroll back to top
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
};
