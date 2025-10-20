use brightbuy;
update table users
set role = 'admin'
where user_id = 9;
update table Staff
set role = "Level01"
where staff_id = 1;
--@block
SELECT *
FROM Staff;