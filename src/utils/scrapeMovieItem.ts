export const scrapeMovieItem = async (selectedItem) => {
  const title = await selectedItem.$eval(
    `.name-c`,
    (el) => (el as HTMLElement).innerText,
  );

  let link = '';
  try {
    link = await selectedItem.$eval(
      `a.name`,
      (el) => (el as HTMLLinkElement).href,
    );
  } catch {}

  let isTVShow = false;
  try {
    isTVShow =
      (await selectedItem.$eval(
        `.label-default`,
        (el) => (el as HTMLLinkElement).innerText,
      )) !== null;
  } catch {}

  let img = await selectedItem.$eval(`.img-c img`, (el) =>
    (el as HTMLElement).getAttribute('data-src'),
  );
  if (!img) {
    img = await selectedItem.$eval(`.img-c img`, (el) =>
      (el as HTMLElement).getAttribute('data-hidden-src'),
    );
  }

  const video = await selectedItem.$eval(`.img-c img`, (el) =>
    (el as HTMLElement).getAttribute('data-video'),
  );

  let rating;
  try {
    rating = await selectedItem.$eval(
      `.rat-rating`,
      (el) => (el as HTMLElement).innerText,
    );
  } catch {}

  let votes;
  try {
    votes = await selectedItem.$eval(
      `.rat-vote span:nth-child(2)`,
      (el) => (el as HTMLElement).innerText,
    );
  } catch {}

  const entries = await selectedItem.$$eval(`.entry`, (el) =>
    el.map((e) => (e as HTMLElement).innerText),
  );
  const values = await selectedItem.$$eval(`.value`, (el) =>
    el.map((e) => (e as HTMLElement).innerText),
  );

  const res = {
    link,
    img,
    video,
    title,
    rating,
    isTVShow,
    votes,
  };

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i].replace(':', '').toLowerCase();
    res[entry] = values[i];
  }
  return res;
};
