create table NFT(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nft_reference VARCHAR(100),
  nft_yield INTEGER(255),
  deposit INTEGER(255),
  date datetime default current_timestamp
);

create table global(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  total_pool INTEGER(255),
  user_count INTEGER(255),
  current_yield_low INTEGER(255),
  current_yield_mid INTEGER(255),
  current_yield_high INTEGER(255)
);