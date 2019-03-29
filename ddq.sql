SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Countries;
DROP TABLE IF EXISTS TotalEmissions;
DROP TABLE IF EXISTS EmissionsPerCapita;
DROP TABLE IF EXISTS RenewableWaterPerCapita;
DROP TABLE IF EXISTS ImprovedSanitationAccess;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE Countries(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  un_code INT,
  alpha2_code VARCHAR(2),
  alpha3_code VARCHAR(3),
  iso_code VARCHAR(10),
  PRIMARY KEY (id)
);
LOAD DATA LOCAL INFILE 'data/countryCodes.csv'
  INTO TABLE Countries
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (name, alpha2_code, alpha3_code, un_code, iso_code);

CREATE TABLE TotalEmissions(
  id INT NOT NULL AUTO_INCREMENT,
  country INT,
  year INT(4),
  data FLOAT DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT te_country FOREIGN KEY (country) REFERENCES Countries(id)
);
CREATE TABLE EmissionsPerCapita(
  id INT NOT NULL AUTO_INCREMENT,
  country INT,
  year INT(4),
  data FLOAT DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT epc_country FOREIGN KEY (country) REFERENCES Countries(id)
);
/* Load emissions total and per capita values into separate tables */
ALTER TABLE TotalEmissions ADD un_code INT;
LOAD DATA LOCAL INFILE 'data/emissions.csv'
  INTO TABLE TotalEmissions
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (@dummy, un_code, @dummy, @dummy, year, @dummy, data);
UPDATE TotalEmissions, Countries
  SET TotalEmissions.country = Countries.id
  WHERE Countries.un_code = TotalEmissions.un_code;
ALTER TABLE TotalEmissions DROP un_code;

ALTER TABLE EmissionsPerCapita ADD un_code INT;
LOAD DATA LOCAL INFILE 'data/emissions.csv'
  INTO TABLE EmissionsPerCapita
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (@dummy, un_code, @dummy, @dummy, year, data, @dummy);
UPDATE EmissionsPerCapita, Countries
  SET EmissionsPerCapita.country = Countries.id
  WHERE Countries.un_code = EmissionsPerCapita.un_code;
ALTER TABLE EmissionsPerCapita DROP un_code;

CREATE TABLE RenewableWaterPerCapita(
  id INT NOT NULL AUTO_INCREMENT,
  country INT,
  year INT(4),
  data FLOAT DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT rwpc_country FOREIGN KEY (country) REFERENCES Countries(id)
);
ALTER TABLE RenewableWaterPerCapita ADD alpha3_code VARCHAR(3);
LOAD DATA LOCAL INFILE 'data/renewable-water-resources-per-capita.csv'
  INTO TABLE RenewableWaterPerCapita
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (@dummy, alpha3_code, year, data);
UPDATE RenewableWaterPerCapita, Countries
  SET RenewableWaterPerCapita.country = Countries.id
  WHERE Countries.alpha3_code = RenewableWaterPerCapita.alpha3_code;
ALTER TABLE RenewableWaterPerCapita DROP alpha3_code;

CREATE TABLE ImprovedSanitationAccess(
  id INT NOT NULL AUTO_INCREMENT,
  country INT,
  year INT(4),
  data FLOAT DEFAULT 0,
  PRIMARY KEY (id),
  CONSTRAINT isa_country FOREIGN KEY (country) REFERENCES Countries(id)
);
ALTER TABLE ImprovedSanitationAccess ADD alpha3_code VARCHAR(3);
LOAD DATA LOCAL INFILE 'data/improvedSanitationAccess.csv'
  INTO TABLE ImprovedSanitationAccess
  FIELDS TERMINATED BY ',' ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  IGNORE 1 ROWS
  (@dummy, alpha3_code, year, data);
UPDATE ImprovedSanitationAccess, Countries
  SET ImprovedSanitationAccess.country = Countries.id
  WHERE Countries.alpha3_code = ImprovedSanitationAccess.alpha3_code;
ALTER TABLE ImprovedSanitationAccess DROP alpha3_code;
