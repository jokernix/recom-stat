export const copyText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!text) {
      reject();
      return;
    }
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    resolve();
  });
};
