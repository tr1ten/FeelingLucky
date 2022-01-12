export const contractAddress = "0x8D2b479E8C5439632fe32966c7Ac816868D9D1C8";

export const abi = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
      inputs: [],
      name: 'enter',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'givePrize',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'manager',
      outputs: [ [Object] ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [ [Object] ],
      name: 'players',
      outputs: [ [Object] ],
      stateMutability: 'view',
      type: 'function'
    }
  ];