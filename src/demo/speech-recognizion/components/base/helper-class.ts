export function commentHandler(list: string[], message): boolean {
  let result = false;
  list.forEach((commandName) => {
    if (message.includes(commandName)) {
      result = true;
    }
  });
  return result;
}
