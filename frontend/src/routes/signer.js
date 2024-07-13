

//account.signMessage({ message: 'Hello World' })
// '0x7b2274797065223a226d657373616765222c226d657373616765223a2248656c6c6f20576f726c64227d'

const eip = {
    "eip712Types": {
        "game":[
            {"name":"address","type":"address"},
            {"name":"gamestate","type":"string"},
            {"name":"timestamp","type":"uint256"}
        ],
        "createAccount": [
                {
                    "name": "address",
                    "type": "address"
                },
                {
                    "name": "timestamp",
                    "type": "uint256"
                }
            ]
        }
    };

const domain = {
        name: "Simple RogueLite",
        version: "2",
        chainId: 11155111,
        verifyingContract: "0x7Da5482Cb6Bb82F86C1bCd83c107a0DD7270423D",
        salt: "0x0123656789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    
}

export default function methods(account) {

    const createAccount = async () => {
        const message =  {
            address: account.address,
            timestamp: Math.floor(new Date().getTime())
        };
        const signature = await account.signTypedData({
            domain,
            types: eip.eip712Types,
            primaryType: "createAccount",
            message
        });

        const body = JSON.stringify({
            msgSender: account.address,
            signature: signature,
            inputs: message,
          });
      
          const res = await fetch(`http://localhost:3004/create`, {
            method: "POST",
            body,
            headers: {
              "Content-Type": "application/json",
            },
          });
          const json = await res.json();
          console.log(json)
          console.log(`Response: ${JSON.stringify(json, null, 2)}`);
          return { ack: json };
    }

    const updateGame = async (gamestate) => {
        const message =  {
            gamestate: String(gamestate),
            address: account.address,
            timestamp: Math.floor(new Date().getTime())
        };
        const signature = await account.signTypedData({
            domain,
            types: eip.eip712Types,
            primaryType: "game",
            message
        });

        const body = JSON.stringify({
            msgSender: account.address,
            signature: signature,
            inputs: message,
          });
      
          const res = await fetch(`http://localhost:3004/updateGamestate`, {
            method: "POST",
            body,
            headers: {
              "Content-Type": "application/json",
            },
          });
          const json = await res.json();
          console.log(json)
          console.log(`Response: ${JSON.stringify(json, null, 2)}`);
          return { ack: json };
    }

    return {createAccount, updateGame}
}