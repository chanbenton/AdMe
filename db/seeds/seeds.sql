DELETE FROM stats;
DELETE FROM shared_links;
DELETE FROM products;
DELETE FROM users;

INSERT INTO users (id,name,email,role,password) VALUES
  (1,'pi','b@a.com','Advertiser', 'asdf'),
  (2,'pi','c@b.com','User', 'asdf'),
  (3,'pi','d@b.com','User', 'asdf')
;

INSERT INTO products (id,title,"desc",img_path) VALUES
  (1,'Google Glasses', 'It''s...under 9000.', '1'),
  (2,'Google Glasses', 'It''s...under 9000.', '2'),
  (3,'Google Glasses', 'It''s...under 9000.', '3'),
  (4,'Google Glasses', 'It''s...under 9000.', '1'),
  (5,'Google Glasses', 'It''s...under 9000.', '2'),
  (6,'Google Glasses', 'It''s...under 9000.', '3')
;

INSERT INTO shared_links (id,products_id, users_id, platform, cost, click_count) VALUES
  (1,1,1,'FB', 0.25, 10),
  (2,1,1,'TW', 1.10, 20),
  (3,1,1,'FB', 0.25, 10),
  (4,1,1,'TW', 1.10, 20),
  (5,1,1,'FB', 0.25, 10),
  (6,1,1,'TW', 1.10, 20),
  (7,1,1,'FB', 0.25, 10),
  (8,1,1,'TW', 1.10, 20)
;

INSERT INTO stats (id,sl_id,"time") VALUES
  (DEFAULT,1, current_date),
  (DEFAULT,2, current_date),
  (DEFAULT,1, current_date),
  (DEFAULT,2, current_date)
;
