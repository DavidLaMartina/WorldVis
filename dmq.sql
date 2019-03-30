/* Get country names, UN code, year, data point
    UN code required for current topojson map

    --Apply formualically to all data point queries */
SELECT Countries.name, Countries.un_code,
  TotalEmissions.year, TotalEmissions.data
  FROM Countries
  RIGHT JOIN TotalEmissions
  ON Countries.id = TotalEmissions.country;

CREATE TABLE Units(
  id INT NOT NULL AUTO_INCREMENT,
  units_name VARCHAR(255) NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);
INSERT INTO Units (units_name, table_name) VALUES
  ('Thousands of Metric Tons', 'TotalEmissions'),
  ('Metric Tons Per Capita', 'EmissionsPerCapita'),
  ('Cubic Meters', 'RenewableWaterPerCapita'),
  ('% of Population with Access', 'ImprovedSanitationAccess');

SELECT table_name FROM Units WHERE table_name = 'ImprovedSanitationAccess';
