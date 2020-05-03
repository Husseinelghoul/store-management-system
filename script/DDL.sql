CREATE TABLE BRANCH(
    branchID    INT NOT NULL,
    managerID INT NOT NULL,
    branchAddress VARCHAR(150) NOT NULL,
    PRIMARY KEY (branchID)
);

CREATE TABLE EMPLOYEE(
	employeeID	INT NOT NULL,
	name		VARCHAR(150) NOT NULL,
    salary		INT NOT NULL,
    emailAddress		VARCHAR(150) NOT NULL UNIQUE,
    phoneNumber        VARCHAR(150) NOT NULL,
    employeeStatus              BOOL NOT NULL,
    branchID    INT NOT NULL,
	PRIMARY KEY (employeeID)
	);

CREATE TABLE SUPPLIER(
	supplierID INT NOT NULL,
	name		VARCHAR(150) NOT NULL UNIQUE,
    phoneNumber VARCHAR(150) NOT NULL,  
	PRIMARY KEY (supplierID)
) ;
CREATE TABLE PRODUCT(
	barcode	VARCHAR(150) NOT NULL,
    supplier INT NOT NULL,
	name		VARCHAR(150) NOT NULL,
    expiryDate     DATE NOT NULL,
    retailPrice    INT NOT NULL,
    supplierPrice  INT NOT NULL,
	PRIMARY KEY (barcode),
    FOREIGN KEY (supplier)  REFERENCES SUPPLIER(supplierID)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ;

CREATE TABLE CUSTOMER (
	branchID INT NOT NULL,
	customerID INT NOT NULL,
	name VARCHAR ( 150 ) NOT NULL,
	deliveryAddress VARCHAR ( 150 ),
	emailAddress VARCHAR ( 150 ),
	phoneNumber VARCHAR ( 150 ),
	customerStatus BOOL NOT NULL,
	UNIQUE ( emailAddress, phoneNumber ),
	PRIMARY KEY ( customerID),
	FOREIGN KEY (branchID ) REFERENCES BRANCH ( branchID )
	ON DELETE RESTRICT ON UPDATE CASCADE

);
CREATE TABLE STOCK(
    productBarcode VARCHAR(150) NOT NULL,
    branchID      INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(productBarcode,branchID),
    FOREIGN KEY (productBarcode) REFERENCES PRODUCT (barcode),
    FOREIGN KEY (branchID) REFERENCES BRANCH (branchID)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);


CREATE TABLE TRANSACTION(
    transactionNumber INT NOT NULL,
    total INT NOT NULL,
    customerID INT NOT NULL,
    employeeID  INT NOT NULL,
    date     DATE NOT NULL,
    PRIMARY KEY(transactionNumber),
    FOREIGN KEY (customerID) REFERENCES CUSTOMER (customerID),
    FOREIGN KEY (employeeID) REFERENCES EMPLOYEE (employeeID)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);
CREATE TABLE INCLUDE(
    productBarcode VARCHAR(150) NOT NULL,
    transactionNumber INT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(productBarcode,transactionNumber),
    FOREIGN KEY (productBarcode) REFERENCES PRODUCT (barcode),
    FOREIGN KEY (transactionNumber) REFERENCES TRANSACTION(transactionNumber)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);
ALTER TABLE BRANCH ADD FOREIGN KEY ( managerID ) REFERENCES EMPLOYEE ( employeeID ) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE EMPLOYEE ADD FOREIGN KEY ( branchID ) REFERENCES BRANCH ( branchID ) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE CUSTOMER ALTER customerStatus SET DEFAULT TRUE;