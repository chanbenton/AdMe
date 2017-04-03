DELETE FROM stats;
DELETE FROM shared_links;
DELETE FROM products;
DELETE FROM users;

INSERT INTO users (id,name,email,role,password) VALUES
  (default,'pi','b@a.com','Advertiser', 'asdf'),
  (default,'pi','c@b.com','User', 'asdf'),
  (default,'pi','d@b.com','User', 'asdf')
;

INSERT INTO products (id,title,"desc",img_path, creator_uid) VALUES
  (1,'Google Glasses', 'It''s...under 9000.', 1, 1),
  (2,'Google Glasses', 'It''s...under 9000.', 2, 1),
  (3,'Google Glasses', 'It''s...under 9000.', 3, 1),
  (4,'Google Glasses', 'It''s...under 9000.', 4, 1)
;

-- INSERT INTO shared_links (id,products_id, users_id, platform, cost, click_count) VALUES
-- ;

INSERT INTO stats (id,sl_id,"time") VALUES
  (1,1, current_date)
;
