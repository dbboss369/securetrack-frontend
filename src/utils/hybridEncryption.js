// src/utils/hybridEncryption.js
import forge from 'node-forge';

/**
 * Hybrid Encryption (AES + RSA)
 * - Encrypts data with AES-256 (no size limit)
 * - Encrypts AES key with RSA-2048
 */

export const generateKeyPair = () => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
  
  return {
    publicKey: publicKeyPem,
    privateKey: privateKeyPem,
  };
};

/**
 * Hybrid Encryption
 * @param {object} dataObject - Data to encrypt
 * @param {string} publicKeyPem - RSA public key
 * @returns {object} - { encryptedData, encryptedKey }
 */
export const hybridEncrypt = (dataObject, publicKeyPem) => {
  try {
    // Step 1: Generate random AES key (32 bytes = 256 bits)
    const aesKey = forge.random.getBytesSync(32);
    const iv = forge.random.getBytesSync(16); // AES block size

    // Step 2: Encrypt data with AES
    const jsonString = JSON.stringify(dataObject);
    const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(jsonString, 'utf8'));
    cipher.finish();
    
    const encryptedData = cipher.output.getBytes();
    
    // Combine IV + encrypted data
    const combined = iv + encryptedData;
    const encryptedDataB64 = forge.util.encode64(combined);

    // Step 3: Encrypt AES key with RSA
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedAesKey = publicKey.encrypt(aesKey, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    const encryptedKeyB64 = forge.util.encode64(encryptedAesKey);

    return {
      encryptedData: encryptedDataB64,  // AES-encrypted data
      encryptedKey: encryptedKeyB64,    // RSA-encrypted AES key
    };
  } catch (error) {
    console.error('Hybrid encryption error:', error);
    throw error;
  }
};

/**
 * Hybrid Decryption
 * @param {string} encryptedDataB64 - Base64 AES-encrypted data
 * @param {string} encryptedKeyB64 - Base64 RSA-encrypted AES key
 * @param {string} privateKeyPem - RSA private key
 * @returns {string} - Decrypted JSON string (NOT parsed object)
 */
export const hybridDecrypt = (encryptedDataB64, encryptedKeyB64, privateKeyPem) => {
  try {
    // Step 1: Decrypt AES key with RSA
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedAesKey = forge.util.decode64(encryptedKeyB64);
    const aesKey = privateKey.decrypt(encryptedAesKey, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });

    // Step 2: Decrypt data with AES
    const combined = forge.util.decode64(encryptedDataB64);
    const iv = combined.substring(0, 16);
    const encryptedData = combined.substring(16);

    const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
    decipher.start({ iv: iv });
    decipher.update(forge.util.createBuffer(encryptedData));
    const success = decipher.finish();

    if (!success) {
      throw new Error('Decryption failed');
    }

    // Return decrypted STRING (caller will parse JSON)
    const decryptedString = decipher.output.toString('utf8');
    return decryptedString;
    
  } catch (error) {
    console.error('Hybrid decryption error:', error);
    throw error;
  }
};

// Legacy functions (keep for backwards compatibility)
export const encryptWithPublicKey = (data, publicKeyPem) => {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

export const decryptWithPrivateKey = (encryptedData, privateKeyPem) => {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encrypted = forge.util.decode64(encryptedData);
    const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
};
