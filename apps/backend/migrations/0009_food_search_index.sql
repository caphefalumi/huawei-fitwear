-- Trigram search preserves the existing case-insensitive substring matching.
CREATE VIRTUAL TABLE food_names_fts USING fts5(name, content='foods', content_rowid='rowid', tokenize='trigram');
--> statement-breakpoint
INSERT INTO food_names_fts(food_names_fts) VALUES('rebuild');
--> statement-breakpoint
CREATE TRIGGER foods_fts_insert AFTER INSERT ON foods BEGIN
  INSERT INTO food_names_fts(rowid, name) VALUES (new.rowid, new.name);
END;
--> statement-breakpoint
CREATE TRIGGER foods_fts_delete AFTER DELETE ON foods BEGIN
  INSERT INTO food_names_fts(food_names_fts, rowid, name) VALUES ('delete', old.rowid, old.name);
END;
--> statement-breakpoint
CREATE TRIGGER foods_fts_update AFTER UPDATE OF name ON foods BEGIN
  INSERT INTO food_names_fts(food_names_fts, rowid, name) VALUES ('delete', old.rowid, old.name);
  INSERT INTO food_names_fts(rowid, name) VALUES (new.rowid, new.name);
END;
