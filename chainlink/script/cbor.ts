import cbor from "cbor";

// Sample CBOR data (Buffer)
const cborHex = "0a"; // CBOR-encoded integer 10
const cborBuffer = Buffer.from(cborHex, "hex");

// Decode CBOR data
cbor.decodeFirst(cborBuffer, (error, decodedData) => {
  if (error) {
    console.error("Decoding error:", error);
  } else {
    console.log("Decoded Data:", decodedData);
  }
});
