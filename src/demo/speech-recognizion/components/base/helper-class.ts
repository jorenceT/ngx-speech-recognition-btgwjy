export function commentHandler(list: string[], message): boolean {
  let result = false;
  list.forEach((commandName) => {
    message = wordCorrection(message);
    if (message.includes(commandName)) {
      result = true;
    }
  });
  return result;
}

export function parseNumericTextToNumber(message: string) {
  var removeComment = message.replace('focus', '');
  let trimedMessage = removeComment.trim();
  let convertedToNumber = convertNumberText(trimedMessage);
  let parsed = parseInt(convertedToNumber, 10);
  if (isNaN(parsed)) {
    return undefined;
  }
  return parsed;
}
const NUMERIC_TEXT_TO_NUMBER_MAP = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  zero: '0',
};

function convertNumberText(message: string) {
  let messageToArray: string[] = message.split(' ');
  let numbers = '';
  messageToArray.forEach((word) => {
    word = word.trim();
    word = word.toLowerCase();
    let correctedWord = wordCorrection(word);
    if (word && NUMERIC_TEXT_TO_NUMBER_MAP[correctedWord]) {
      numbers = numbers + NUMERIC_TEXT_TO_NUMBER_MAP[correctedWord];
    }
  });
  return numbers;
}

export function wordCorrection(word) {
  return WORD_CORRECTION_LIST[word] ?? word;
}

const WORD_CORRECTION_LIST = {
  ['hero']: 'zero',
  ['tap']: 'tab',
};

export const GLOBAL_COMMAND = {
  stopButton: ['stop button'],
  focus: ['focus', 'select'],
};
