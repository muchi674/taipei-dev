function getDataURLFromImageByteArray(s3Key, data) {
  const fileExtension = s3Key.split(".").pop();
  let mediaType;

  switch (fileExtension) {
    case "png":
      mediaType = "image/png";
      break;
    case "jpg":
    case "jpeg":
      mediaType = "image/jpeg";
      break;
    default:
      throw Error("unsupported image type");
  }

  const binaryString = data.reduce(function (a, b) {
    return a + String.fromCharCode(b);
  }, "");
  const base64String = window.btoa(binaryString).replace(/.{76}(?=.)/g, "$&\n");

  return `data:${mediaType};base64,` + base64String;
}

export { getDataURLFromImageByteArray };
