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
  (1,'Google Glasses', 'It''s...under 9000.', 1),
  (2,'Google Glasses', 'It''s...under 9000.', 2),
  (3,'Google Glasses', 'It''s...under 9000.', 3),
  (4,'Google Glasses', 'It''s...under 9000.', 4)
;

INSERT INTO shared_links (id,products_id, users_id, platform, cost, click_count) VALUES
  (1,1,1,'Facebook', 0.25, 10),
  (2,1,1,'Twitter', 1.10, 20),
;
INSERT INTO stats (id,sl_id,"time") VALUES
  (1,1, current_date)
  
;
