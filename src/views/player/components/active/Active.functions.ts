export const displayPlayerHand = (Hand?: string[]) => {
  if (!!Hand?.length) {
    console.log("display hand:", Hand);
    const numberToDisplay = Hand?.length >= 5 ? 5 : Hand?.length;
    return Hand.slice(0, numberToDisplay);
  }
  return [];
};
