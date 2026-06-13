const generateRandomString = (len=100) => {
  const chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const charsLen = chars.length;
  let random = "";

  for(let i=0; i<len; i++){
    const posn = Math.ceil(Math.random() * (charsLen-1));
    random += chars[posn]
  }
  return random;
}

module.exports = {
  generateRandomString,
}