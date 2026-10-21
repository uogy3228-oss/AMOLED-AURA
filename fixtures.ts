const page = (id: number, w: number, h: number, mime = 'image/jpeg') => ({
  pageid: id, index: id, title: `File:Pic_${id}.jpg`,
  imageinfo: [{ url: `https://upload.wikimedia.org/o${id}.jpg`, thumburl: `https://upload.wikimedia.org/t${id}.jpg`, thumbwidth: 600, thumbheight: Math.round((600 * h) / w),
    width: w, height: h, mime, descriptionurl: `https://commons.wikimedia.org/wiki/File:Pic_${id}.jpg`,
    extmetadata: { Artist: { value: '<a href="x">Jane</a>' }, LicenseShortName: { value: 'CC BY-SA 4.0' }, LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0' } } }],
});
export const apiResponse = { continue: { gsroffset: 30, continue: '-||' }, query: { pages: { 1: page(1, 2000, 3000), 2: page(2, 3000, 2000), 3: page(3, 500, 800), 4: page(4, 2000, 3000, 'image/svg+xml'), 5: page(5, 1500, 2400) } } };
