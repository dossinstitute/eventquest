// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Pairing.sol";

contract Verifier {
    using Pairing for *;

    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[3] gamma_abc; // Correctly initialize as a fixed-size array
    }

    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }

    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(
            uint256(0x10dd838d01df3234212611dc7aa61861a158f2a66dcf88cb189f94be0357332b),
            uint256(0x17975eb74bb2249fa7eaecff970cdee429eeacc99de39cc296794ba3fa5e2ca1)
        );
        vk.beta = Pairing.G2Point(
            [
                uint256(0x2f56303f0c78b84eb44225e787d987c6865940e8e7fc7ed4438f0e0173b143af),
                uint256(0x02f74f9908fc8858d2bcaa5193997bd18949c16034c42a5e80a74a456d604ff2)
            ],
            [
                uint256(0x15b78fb4d3287facc63111741be3a236ae4802af4eb93c916fa0b1db2c159d46),
                uint256(0x279dccc6cfcbe436f2af2dd079e1c5f5ee7b027ebe4223a4011451395526418c)
            ]
        );
        vk.gamma = Pairing.G2Point(
            [
                uint256(0x0adb61696c818e0a539da8b5469d563c6c5c5c0c9ea019a1604a89f880d15cbb),
                uint256(0x047b3821207d5a40ef93a36e992deb573d1c26bc7153e906d4922cda31823f40)
            ],
            [
                uint256(0x1c123ec3f21756928032ef0fdc98156d892577c2d50b6006d4ec36d56dc5f7dc),
                uint256(0x0b8bbeac53824c791c4da4c9e911b952ff5bba7fa583415fe295b6efac4624e2)
            ]
        );
        vk.delta = Pairing.G2Point(
            [
                uint256(0x2fa0f32103fd0c650a4730bfd71c744de4d3bf5ff607dea1a05e0a2e707c9494),
                uint256(0x29f506990991ab4c11123860569756b90311bfde6cfaed86cb1e472891f83a5c)
            ],
            [
                uint256(0x2581d38521f233eef02a9f125ec952b2f4cade0795c8b94efa7d0405d4c73e61),
                uint256(0x039306e7ee15eeca947f1ce3238830d2c53c7d1b552ffb7681c9db006c246bdf)
            ]
        );
        vk.gamma_abc[0] = Pairing.G1Point(
            uint256(0x220af30be4c5336bc2a2085e9fbe9d6e933b8d3b7e17d03f25083ffd2b52fb8f),
            uint256(0x0e6f4c1aa96055a9e49fe8fe76069042fd1711ba5573769153fec95963cac63f)
        );
        vk.gamma_abc[1] = Pairing.G1Point(
            uint256(0x2c378a994f621f4dc3048409d84bf92f366514a203e11585ec1970a0b87d68e6),
            uint256(0x2adf04b0dcca4cae402c141d58f4b024dbe90fe403263ef62534368e37b1711d)
        );
        vk.gamma_abc[2] = Pairing.G1Point(
            uint256(0x2b2a66e33bc4beb1d0f0f9b336c29ddfa15c62c7a6aa7eaa07db1337e17d1f0b),
            uint256(0x1a44cfa6a4f8767426955fa4442ea069e230920925d091145ed9246f9bca7df6)
        );
    }

    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if (!Pairing.pairingProd4(
            proof.a, proof.b,
            Pairing.negate(vk_x), vk.gamma,
            Pairing.negate(proof.c), vk.delta,
            Pairing.negate(vk.alpha), vk.beta
        )) return 1;
        return 0;
    }

    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) public view returns (bool r) {
        Proof memory proof;
        proof.a = Pairing.G1Point(a[0], a[1]);
        proof.b = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.c = Pairing.G1Point(c[0], c[1]);
        uint[] memory inputValues = new uint[](1);

        for (uint i = 0; i < input.length; i++) {
            inputValues[i] = input[i];
        }
        return verify(inputValues, proof) == 0;
    }
}

