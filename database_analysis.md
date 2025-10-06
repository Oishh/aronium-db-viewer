# Aronium Database Analysis

**Database File**: `aronium-db-backup-2025-09-17-21-35-54.db`  
**Analysis Date**: September 17, 2025  
**Database Type**: SQLite - Point of Sale (POS) System  

## Database Overview

This database contains **42 tables** supporting a Point of Sale system for what appears to be a construction materials/hardware business. The database includes extensive transaction history, inventory management, customer records, and system configuration.

## Table Summary

| Table Name | Record Count | Description | Key Fields |
|------------|--------------|-------------|------------|
| **ProductGroup** | 0 | Product categories/groups | - |
| **FiscalItem** | 0 | Fiscal/tax related items | - |
| **SecurityKey** | 7 | System security permissions | Settings, permissions |
| **PaymentType** | 18 | Payment methods configuration | Cash, GCASH, Online Banking |
| **Counter** | 7 | Document numbering counters | Document sequences |
| **FloorPlan** | 1 | Store layout configuration | Main floor layout |
| **FloorPlanTable** | 3 | Table positions in floor plan | A1, A2, A3 tables |
| **Currency** | 0 | Currency configurations | - |
| **User** | 1 | System users | Mariz Otero (Admin) |
| **Country** | 241 | Complete country list | All world countries |
| **Customer** | 1,643 | Customer database | Customer details, contacts |
| **Company** | 0 | Company information | - |
| **Migration** | 65 | Database schema migrations | Version history |
| **CustomerDiscount** | 0 | Customer discount rules | - |
| **PosPrinterSettings** | 0 | POS printer configurations | - |
| **PosPrinterSelection** | 4 | Active printer selections | Receipt, Kitchen printers |
| **ApplicationProperty** | 10 | System configuration | API URLs, DB version |
| **LoyaltyCard** | 0 | Loyalty program cards | - |
| **Promotion** | 0 | Promotional campaigns | - |
| **PromotionItem** | 0 | Items in promotions | - |
| **Warehouse** | 1 | Warehouse locations | Single warehouse |
| **DocumentCategory** | 4 | Document categories | Expenses, Sales, Inventory |
| **DocumentType** | 7 | Types of documents | Purchase, Sales, Inventory |
| **Stock** | 2,158 | Inventory levels | Product quantities |
| **Document** | 13,810 | Business documents | Sales receipts, invoices |
| **Payment** | 14,328 | Payment records | Payment transactions |
| **Barcode** | 0 | Barcode configurations | - |
| **ZReport** | 438 | Daily sales reports | End-of-day summaries |
| **PosOrder** | 0 | POS order queue | - |
| **PosOrderItem** | 0 | Items in POS orders | - |
| **PosPrinterSelectionSettings** | 2 | Printer format settings | Receipt formatting |
| **StartingCash** | 1,348 | Daily cash drawer starting amounts | Cash register openings |
| **ProductComment** | 0 | Product comments/notes | - |
| **Tax** | 0 | Tax configurations | - |
| **ProductTax** | 0 | Product tax assignments | - |
| **DocumentItemTax** | 0 | Document item taxes | - |
| **Product** | 2,951 | Product catalog | Construction materials |
| **DocumentItem** | 51,730 | Line items in documents | Individual sale items |
| **PrintStation** | 0 | Print station configurations | - |
| **ProductPrintStation** | 0 | Product-printer assignments | - |
| **ProductGroupPrintStation** | 0 | Group-printer assignments | - |
| **PrintStationPosPrinterSelection** | 0 | Print station selections | - |
| **StockControl** | 0 | Stock control records | - |

---

## Sample Data by Table

### 👤 User Table

**Records**: 1  
**Purpose**: System user accounts and permissions

| ID | First Name | Last Name | Username | Password Hash | Access Level | Email |
|----|------------|-----------|----------|---------------|--------------|-------|
| 1 | Mariz | Otero F-09812458910 | (empty) | 6A8328B1DA...72B7 | 9 | <1975floresmariz@gmail.com> |

---

### 🏪 Customer Table

**Records**: 1,643  
**Purpose**: Customer database with contact information

| ID | First Name | Last Name | Company | Address | Created Date |
|----|------------|-----------|---------|---------|--------------|
| 1 | (empty) | Unknown | (empty) | (empty) | 2016-03-27 10:15:55 |
| 2 | (empty) | FE PAULITE | (empty) | POB 5 | 2023-07-01 09:00:56 |
| 3 | (empty) | SENYONG | (empty) | SILANGAN | 2023-07-01 09:15:55 |

---

### 📦 Product Table

**Records**: 2,951  
**Purpose**: Product catalog for construction materials

| ID | Code | Name | Unit | Price | Cost | Created Date |
|----|------|------|------|-------|------|--------------|
| 1 | (empty) | RSB 10mm | PC | 154.0 | 132.85 | 2023-06-18 20:21:07 |
| 2 | (empty) | RSB 12mm | PC | 214.0 | 186.85 | 2023-06-18 20:21:07 |
| 3 | (empty) | RSB 16mm | pc | 374.0 | 330.55 | 2023-06-18 20:21:07 |

> Note: RSB appears to be Rebar/Steel Bars in various diameters*

---

### 📄 Document Table

**Records**: 13,810  
**Purpose**: Business transaction documents (sales, purchases, etc.)

| ID | Number | Customer ID | Type ID | Date | Total | Status |
|----|--------|-------------|---------|------|-------|---------|
| 2 | 23-200-000001 | 1 | 2 | 2023-06-18 | 352 | Active |
| 3 | 23-200-000002 | 1 | 3 | 2023-06-18 | 702 | Active |
| 4 | 23-200-000003 | 1 | 6 | 2023-07-01 | 3190 | Active |

---

### 🛒 DocumentItem Table

**Records**: 51,730  
**Purpose**: Individual line items within documents

| Document ID | Product ID | Quantity | Unit Price | Total |
|-------------|------------|----------|------------|-------|
| 2 | 820 | 1 | 220 | 220 |
| 2 | 1611 | 1 | 132 | 132 |
| 3 | 1166 | 1 | 290 | 290 |

---

### 💳 Payment Table

**Records**: 14,328  
**Purpose**: Payment records linked to documents

| ID | Document ID | Payment Type ID | Amount | Date |
|----|-------------|-----------------|--------|------|
| 2 | 2 | 1 | 352 | 2023-06-18 |
| 3 | 3 | 1 | 702 | 2023-06-18 |
| 4 | 4 | 1 | 3190 | 2023-07-01 |

---

### 💰 PaymentType Table

**Records**: 18  
**Purpose**: Available payment methods

| ID | Name | Type | Is Default | Order |
|----|------|------|------------|-------|
| 1 | Cash | 0 | 1 | 1 |
| 2 | GCASH | 1 | 1 | 2 |
| 3 | ONLINE BANKING | 1 | 1 | 3 |

---

### 📊 Stock Table

**Records**: 2,158  
**Purpose**: Current inventory levels

| Product ID | Warehouse ID | Quantity |
|------------|--------------|----------|
| 3950 | 1 | -15537 |
| 3951 | 2 | -4502 |
| 3952 | 3 | -1331 |

> Note: Negative values indicate oversold/backorder situations*

---

### 💵 StartingCash Table

**Records**: 1,348  
**Purpose**: Daily cash register starting amounts

| ID | Warehouse ID | Amount | Description | Date |
|----|--------------|--------|-------------|------|
| 1 | 1 | 300 | lunch | 2023-07-01 21:10:54 |
| 2 | 1 | 210 | gasoline | 2023-07-01 21:11:25 |
| 3 | 1 | 1000 | diesel truck | 2023-07-01 21:11:43 |

---

### 🏢 FloorPlan & FloorPlanTable

**Records**: 1 floor plan, 3 tables  
**Purpose**: Store layout and table positioning

**Floor Plan:**

| ID | Name | Background |
|----|------|------------|
| 1 | Main floor | Transparent |

**Tables:**

| ID | Name | X | Y | Width | Height |
|----|------|---|---|-------|--------|
| 1 | A1 | 10.0 | 10.0 | 120.0 | 120.0 |
| 2 | A2 | 160.0 | 10.0 | 120.0 | 120.0 |
| 3 | A3 | 320.0 | 10.0 | 120.0 | 120.0 |

---

### 🔐 SecurityKey Table

**Records**: 7  
**Purpose**: System permissions and access control

| Permission | Value |
|------------|-------|
| Settings | 0 |
| Order.Void | 0 |
| Order.Item.Void | 0 |

---

### 🖨️ Printer Configuration Tables

**PosPrinterSelection** (4 records):

| ID | Type | Printer Name | Enabled |
|----|------|--------------|---------|
| 1 | ReceiptPrinter | EPSON L120 Series (Copy 1) | 1 |
| 2 | Estimate | (empty) | 0 |
| 3 | KitchenTicket | EPSON L3110 Series | 0 |

**PosPrinterSelectionSettings** (2 records):

- Receipt printer: 80mm width, custom headers/footers
- Kitchen printer: 58mm width, basic formatting

---

### 🌍 Country Table

**Records**: 241  
**Purpose**: Complete list of world countries

| ID | Name | Code |
|----|------|------|
| 1 | Afghanistan | AF |
| 2 | Albania | AL |
| 3 | Algeria | DZ |
| ... | ... | ... |

---

### ⚙️ ApplicationProperty Table

**Records**: 10  
**Purpose**: System configuration settings

| Property | Value |
|----------|-------|
| Application.Api.BaseUrl | <https://api.aronium.com/api> |
| Application.Id | bd58b048-6eb5-490e-b24b-34d20ef43160 |
| Database.Backup.Version | 1.38.2.0 |

---

### 📈 ZReport Table

**Records**: 438  
**Purpose**: Daily sales summary reports

| ID | Start Document | End Document | Count | Date |
|----|----------------|--------------|-------|------|
| 1 | 0 | 0 | 0 | 2023-05-10 10:07:06 |
| 2 | 1 | 2 | 20 | 2023-07-01 21:12:58 |
| 3 | 2 | 21 | 40 | 2023-07-02 17:16:13 |

---

## Business Insights

### Transaction Volume

- **Total Documents**: 13,810 (sales, purchases, inventory adjustments)
- **Total Line Items**: 51,730 individual product sales
- **Total Payments**: 14,328 payment transactions
- **Daily Reports**: 438 Z-reports generated

### Product Catalog

- **Total Products**: 2,951 items (primarily construction materials)
- **Product Focus**: Rebar/Steel bars (RSB) in various sizes (10mm, 12mm, 16mm)
- **Inventory Issues**: Many negative stock levels indicating overselling

### Customer Base

- **Total Customers**: 1,643 registered customers
- **Default Customer**: "Unknown" for walk-in sales

### System Configuration

- **Primary User**: Mariz Otero (Administrator level 9)
- **Payment Methods**: Cash, GCASH, Online Banking (18 total types)
- **Printers**: EPSON L120 (receipts), EPSON L3110 (kitchen tickets)
- **Floor Plan**: Single floor with 3 tables (A1, A2, A3)

### Data Quality Notes

- Many empty username fields in User table
- Negative inventory levels suggest need for stock reconciliation
- Extensive migration history (65 migrations) indicates active development
- Regular Z-report generation shows good end-of-day procedures

This database represents an active, well-used POS system for a construction materials business with significant transaction history and comprehensive feature set.
