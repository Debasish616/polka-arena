// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DotcadeGameRegistry {
    struct Game {
        uint256 id;
        address owner;
        string title;
        string description;
        string ipfsHash;
        string thumbnailIpfs;
        string category;
        uint256 uploadTimestamp;
        uint256 playCount;
    }

    mapping(uint256 => Game) public games;
    mapping(address => uint256[]) public ownerGames;
    uint256 public gameCount;

    event GameUploaded(uint256 indexed gameId, address indexed owner, string title);
    event GamePlayed(uint256 indexed gameId);

    function uploadGame(
        string memory title,
        string memory description,
        string memory ipfsHash,
        string memory thumbnailIpfs,
        string memory category
    ) external returns (uint256) {
        uint256 gameId = gameCount;

        games[gameId] = Game({
            id: gameId,
            owner: msg.sender,
            title: title,
            description: description,
            ipfsHash: ipfsHash,
            thumbnailIpfs: thumbnailIpfs,
            category: category,
            uploadTimestamp: block.timestamp,
            playCount: 0
        });

        ownerGames[msg.sender].push(gameId);
        gameCount++;

        emit GameUploaded(gameId, msg.sender, title);
        return gameId;
    }

    function getGame(uint256 gameId) external view returns (Game memory) {
        return games[gameId];
    }

    function incrementPlayCount(uint256 gameId) external {
        games[gameId].playCount++;
        emit GamePlayed(gameId);
    }

    function getGamesByOwner(address owner) external view returns (uint256[] memory) {
        return ownerGames[owner];
    }

    function getAllGames(uint256 start, uint256 limit) external view returns (Game[] memory) {
        uint256 end = start + limit;
        if (end > gameCount) {
            end = gameCount;
        }

        uint256 resultSize = end - start;
        Game[] memory result = new Game[](resultSize);

        for (uint256 i = 0; i < resultSize; i++) {
            result[i] = games[start + i];
        }

        return result;
    }
}
