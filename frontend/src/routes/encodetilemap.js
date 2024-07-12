export function doEncode(data) {

    let maxW = 0, maxH = 0;

    Object.keys(data).forEach((key) => {
        const [x, y] = key.split(',');
        maxW = Math.max(maxW, parseInt(x));
        maxH = Math.max(maxH, parseInt(y));
    });

    const binaryStr = [];
    for (let y = 0; y <= maxH; y++) {
        for (let x = 0; x <= maxW; x++) {
            let v = data[[x, y].join(',')];
            let walkable = v.walkable ? '1' : '0';
            let wall = v.wall ? '1' : '0';
            let explored = v.explored ? '1' : '0';
            binaryStr.push(walkable + wall + explored);
        }
    }

    // Unir todos los bits en una sola cadena
    const bitString = binaryStr.join('');

    // Convertir la cadena binaria a un buffer
    const byteArray = new Uint8Array(Math.ceil(bitString.length / 8));
    for (let i = 0; i < bitString.length; i += 8) {
        byteArray[i / 8] = parseInt(bitString.slice(i, i + 8).padEnd(8, '0'), 2);
    }

    // Comprimir usando zlib
    //const compressedData = zlib.deflateSync(byteArray);

    return {
        byteArray: byteArray.join(',').split(',').map(e=> Number(e)),
        maxW,
        maxH
    };

}

export function doDecode({byteArray: data, maxW, maxH}) {
    const decompressedBitString = Array.from((data)).map(byte => byte.toString(2).padStart(8, '0')).join('');
    const originalData = {};
    let index = 0;

    for (let y = 0; y <= maxH; y++) {
        for (let x = 0; x <= maxW; x++) {
            const walkable = decompressedBitString[index] === '1';
            const wall = decompressedBitString[index + 1] === '1';
            const explored = decompressedBitString[index + 2] === '1';
            originalData[[x, y].join(',')] = {
                walkable: walkable,
                wall: wall,
                explored: explored
            };
            index += 3;
        }
    }
    return originalData;

}