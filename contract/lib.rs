#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod dotcade_game_registry {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    #[derive(Debug, PartialEq, Eq, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct Game {
        pub id: u64,
        pub owner: AccountId,
        pub title: String,
        pub description: String,
        pub ipfs_hash: String,
        pub thumbnail_ipfs: String,
        pub category: String,
        pub upload_timestamp: u64,
        pub play_count: u64,
    }

    #[ink(storage)]
    pub struct DotcadeGameRegistry {
        games: Mapping<u64, Game>,
        game_count: u64,
        owner_games: Mapping<AccountId, Vec<u64>>,
    }

    #[ink(event)]
    pub struct GameUploaded {
        #[ink(topic)]
        game_id: u64,
        #[ink(topic)]
        owner: AccountId,
        title: String,
    }

    #[ink(event)]
    pub struct GamePlayed {
        #[ink(topic)]
        game_id: u64,
    }

    impl DotcadeGameRegistry {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                games: Mapping::default(),
                game_count: 0,
                owner_games: Mapping::default(),
            }
        }

        #[ink(message)]
        pub fn upload_game(
            &mut self,
            title: String,
            description: String,
            ipfs_hash: String,
            thumbnail_ipfs: String,
            category: String,
        ) -> u64 {
            let game_id = self.game_count;
            let caller = self.env().caller();
            let timestamp = self.env().block_timestamp();

            let game = Game {
                id: game_id,
                owner: caller,
                title: title.clone(),
                description,
                ipfs_hash,
                thumbnail_ipfs,
                category,
                upload_timestamp: timestamp,
                play_count: 0,
            };

            self.games.insert(game_id, &game);

            let mut owner_game_list = self.owner_games.get(&caller).unwrap_or_default();
            owner_game_list.push(game_id);
            self.owner_games.insert(caller, &owner_game_list);

            self.game_count += 1;

            self.env().emit_event(GameUploaded {
                game_id,
                owner: caller,
                title,
            });

            game_id
        }

        #[ink(message)]
        pub fn get_game(&self, game_id: u64) -> Option<Game> {
            self.games.get(game_id)
        }

        #[ink(message)]
        pub fn increment_play_count(&mut self, game_id: u64) {
            if let Some(mut game) = self.games.get(game_id) {
                game.play_count += 1;
                self.games.insert(game_id, &game);

                self.env().emit_event(GamePlayed { game_id });
            }
        }

        #[ink(message)]
        pub fn get_total_games(&self) -> u64 {
            self.game_count
        }

        #[ink(message)]
        pub fn get_games_by_owner(&self, owner: AccountId) -> Vec<u64> {
            self.owner_games.get(&owner).unwrap_or_default()
        }

        #[ink(message)]
        pub fn get_all_games(&self, start: u64, limit: u64) -> Vec<Game> {
            let mut games = Vec::new();
            let end = core::cmp::min(start + limit, self.game_count);

            for i in start..end {
                if let Some(game) = self.games.get(i) {
                    games.push(game);
                }
            }

            games
        }
    }
}
