
DELETE FROM shared_links;


INSERT INTO shared_links (id,products_id, users_id, platform, cost, click_count) VALUES
  (1,16,22,'Facebook', 0.25, 10),
  (1,16,22,'Twitter', 0.20, 10),
  (2,17,22,'Facebook', 0.25, 25),
  (2,17,22,'Twitter', 0.20, 15),
  (2,18,22,'Facebook', 0.25, 30),
  (2,18,22,'Twitter', 0.20, 20),
;
