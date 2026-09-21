/**
 * M3 message text, keyed by message ID. GENERATED — do not edit by hand.
 *
 * Regenerate with validation/tools/extract-mi-messages.mjs, which reads Infor's
 * sources and keeps only codes reachable from the transactions this script
 * calls. M3 usually sends its own text; this fills the gap when it sends a bare
 * code, which is the normal case for MSID on an unprocessed line.
 *
 * `t` is the text, `&1` placeholders as Infor writes them. `cut` marks text
 * Infor's own comment truncates. `alt` holds other wordings the same code
 * carries, so a response matching any of them is still recognised.
 */

export interface MiMessage {
  t: string;
  cut?: number;
  alt?: string[];
}

/** 272 codes. */
export const MI_MESSAGES: Record<string, MiMessage> = {
  CO30008: { t: 'Item is not lot controlled' },
  CR41847: { t: 'Agreement &1 does not exist for customer &2' },
  DR_0122: { t: 'Issues must be confirmed on the shipment level when load building is used' },
  DR_0149: { t: 'Option is not permitted. Freight cost header status is &1' },
  ED01016: { t: 'Message type does not exist for partner', alt: ['Message Type does not exist for Partner'] },
  MH80301: { t: 'Package detail record does not exist' },
  MH85008: { t: 'Overreporting not allowed' },
  MH85009: { t: 'Processing allowed status is 90' },
  MH85101: { t: 'pre-pack number is only allowed with qualifier 29' },
  MH85205: { t: 'Put-away number does not exist' },
  MH85210: { t: 'The full quantity on the combination of location/item/lot number/container is different than the transaction quantity' },
  MH85401: { t: 'Number of sublots must be equal to the Delivered quantity for a message line in Message Line record' },
  MH87004: { t: 'Wrong item number' },
  MH87005: { t: 'Delivery note data does nor match' },
  MH87006: { t: 'Partial movements not permitted for packed items' },
  MH87007: { t: 'Cannot add order line' },
  MM17704: { t: 'Item &1 is not a catch weight item' },
  MM24013: { t: 'Status can not be changed to &1 manually for models (in', cut: 1 },
  MM24031: { t: 'Serial number must be blank, lot numbering method is &1' },
  MM24032: { t: 'Adding serial number not permitted, lot numbering method is &1' },
  MM24044: { t: 'Serial number &1 already exists in status 99' },
  MM42103: { t: 'Available quantity qty is &1 for the line' },
  MM98501: { t: 'Individual item is not defined' },
  MM98502: { t: 'The item has lot control method 2 - transaction qty can', cut: 1 },
  MM98504: { t: 'Individual item already exists' },
  MM_0100: { t: 'Cannot allocate more than allocable per bal ID' },
  MO10006: { t: 'Open WO\'s on the old Item/Serial number must be closed first' },
  MO48302: { t: 'Field length is too long, may not exceed &2 caracters' },
  MW15503: { t: 'More than one lot exists in the \'To\' location' },
  MW41079: { t: 'Option not allowed. The delivery &1 has been stopped with stop code &2' },
  MW42027: { t: 'Completion flag is not allowed for dispatch policy &1' },
  MW42028: { t: 'No balance ID found for specified lot number/location/container' },
  MW42050: { t: 'Reporting date cannot be prior to pick list creation date' },
  MW42209: { t: 'Report or delete not allowed - &1 units are packed already' },
  MW42220: { t: 'Delivery not fully packed' },
  MW42222: { t: 'Overissues not allowed for soft allocated pick line', alt: ['Overissues not allowed for dispatch policy &1'] },
  MW42223: { t: 'Available quantity is &1 for the line' },
  MW42310: { t: 'Package number &1 does not exist' },
  MW42332: { t: 'Destination for package and shipment package is not the same' },
  MW42334: { t: 'Reference sublot ID &1 is already packed' },
  MW44502: { t: 'Receiving more than delivered is not possible' },
  MW46005: { t: 'Enter new location' },
  MW_0008: { t: 'Delivery &1 invoiced - correction not allowed' },
  MW_0009: { t: 'Allocation does not exist' },
  MW_0028: { t: 'Correction not allowed - costing/production statistics' },
  MW_0031: { t: 'Proof of delivery performed on delivery &1 - correction not allowed' },
  MW_0032: { t: 'Correct picking list not allowed when packing actions are performed' },
  OI10192: { t: 'Individual item already exists on location' },
  OI_0165: { t: 'A sublot controlled item is not allowed' },
  PP25010: { t: 'Warehouse &1 on PO is not the same as the one selected' },
  PP30002: { t: 'Order number or item number must be entered' },
  PP30003: { t: 'Order status is 50 or higher, entry not permitted' },
  PP30004: { t: 'Order category is 10, entry not permitted' },
  PP30005: { t: 'Quantity must be entered' },
  PP30006: { t: 'Transaction date is a future date' },
  PP30010: { t: 'Quantity must be left blank' },
  PP30014: { t: 'Item number cannot be entered' },
  PP30017: { t: 'Display To delivery date &1 is not permitted' },
  PP30019: { t: 'Quantity received is greater than quantity remaining' },
  PP30025: { t: 'No PO or delivery schedule exists for item &1 warehouse' },
  PP30029: { t: 'Lot number cannot be entered' },
  PP30031: { t: 'The lot is connected to another reference' },
  PP30039: { t: 'According to the agreement lot number may not be changed' },
  PP30041: { t: 'Containers are not allowed' },
  PP30045: { t: 'Component is not in supplier location' },
  PP30048: { t: 'Negative CO delivery must be invoiced before reporting n' },
  PP30052: { t: 'Inspection point &1 is not allowed on non-stocked items' },
  PP30061: { t: 'Req/Distr order line is not completed' },
  PP30062: { t: 'Goods receipt for an advised order with a delivery note is not allowed in this program, use PPS360' },
  PP30063: { t: 'Inspection point &1 is not allowed for repair order' },
  PP30065: { t: 'Balance ID already exists' },
  PP30066: { t: 'A stock location with status 1 is not allowed - the stock location must have status 2' },
  PP30069: { t: 'Goods receiving method with inspection point &1 is not allowed for subcontracted order' },
  PP30071: { t: 'Two step put-away is not allowed for PO &1 line &2' },
  PP31032: { t: 'Manufacturing date is later than current date' },
  PP36501: { t: 'A package already exists with SSCC number &1' },
  PP_0014: { t: 'Direct putaway must be used for direct delivery' },
  RP_0004: { t: 'The function is not permitted in simulation mode' },
  SO11008: { t: 'Agreement &1 cannot be used - the status is &2' },
  SO12090: { t: 'The transaction is not available in this version' },
  S_00148: { t: 'UTC time conversion failed' },
  S_00167: { t: 'Deletion not permitted - equipment is installed in site &1. Equipment removal needs to be done using MOS125' },
  S_00573: { t: 'Partial reporting of CO returns not allowed' },
  S_00647: { t: 'To maintain or report a PO with category &1, is not allowed' },
  S_00781: { t: ': The package is included in a package structure - reverse not allowed' },
  S_00871: { t: 'Reported quantity &1 in &2 is invalid and will be zero when converted to basic U/M in &3' },
  S_00964: { t: 'Move to pack or dock location is not allowed for transaction type &1' },
  S_01111: { t: 'Cannot process PO line with a broken receipt' },
  S_01139: { t: 'Import registration is not allowed for the country code of the receiving warehouse' },
  S_01157: { t: 'No container management at location &1. Item &2 cannot be moved to container managed location &3' },
  S_01195: { t: 'Receipt is not allowed, maximum number of receipts for a PO line (999) have already been reported' },
  S_01302: { t: 'Manufacturer &1 is not approved for item &2' },
  S_01322: { t: 'Manufacturer &1 not approved for item &1, goods receiving method must include quality inspection' },
  S_01339: { t: 'Manufacturer &1 not approved for item &2, change to status 1 location' },
  S_01397: { t: 'Package &1 already exists in warehouse &2' },
  S_01400: { t: 'An internal purchase order must be advised via a delivery note before received' },
  S_01484: { t: 'Balance ID entered not found in package &1' },
  S_01603: { t: 'Item &1 warehouse &2 is flagged for reporting of full balance ID allocation. Quantity mismatch' },
  S_01604: { t: 'Move not allowed. To balance ID already exists. Item flagged for processing in full balance ID mode' },
  S_01697: { t: 'Receipt is not allowed against sts 1 location when PO line is order initiated/includes supply chain policy' },
  S_01699: { t: 'Receipt is not allowed against sts 1 location for items with aging settings enabled' },
  S_02005: { t: 'No allocated balance IDs found for package &1 on delivery &2' },
  S_02475: { t: ': Shipment packages are not eligible for reverse' },
  S_02532: { t: 'Packaging actions are performed - reverse not allowed' },
  S_02537: { t: ': Delivery &1 invoiced - reverse not allowed' },
  S_02641: { t: 'Package(s) already exist in stock' },
  S_02642: { t: ': Non-container managed items found' },
  S_02728: { t: 'Packaging &1 is a crate' },
  S_03062: { t: ': Proof of delivery performed on delivery &1 - reverse not allowed' },
  S_03150: { t: ': Status is &1 - reverse not allowed' },
  WAA1803: { t: 'Agreement number does not exist' },
  WAD1001: { t: 'Address number &1 is invalid' },
  WAD1003: { t: 'Address number &1 does not exist' },
  WAG1103: { t: 'Agreement number &1 does not exist' },
  WARD101: { t: 'Arrival date &1 is invalid' },
  WAS3004: { t: 'Fixed asset already exists' },
  WAT8003: { t: 'Atribute identity &1 does not exist' },
  WBA0402: { t: 'Lot number must be entered' },
  WBANT03: { t: 'Reference sublot ID &1 does not exist' },
  WBBDT01: { t: 'Best before date &1 is invalid' },
  WBR1103: { t: 'Brand &1 does not exist' },
  WCA1E02: { t: 'Catch weight must be entered' },
  WCF8002: { t: 'Custom field must be entered' },
  WCF8003: { t: 'Custom field &1 does not exist' },
  WCF8101: { t: 'Custom field Alpha &1 is invalid' },
  WCF8102: { t: 'Custom field Alpha must be entered' },
  WCF8201: { t: 'Custom field Numeric &1 is invalid' },
  WCF8202: { t: 'Custom field Numeric must be entered', alt: ['Custom field alpha must be entered'] },
  WCF8301: { t: 'Custom field Date &1 is invalid' },
  WCF8302: { t: 'Custom field Date must be entered', alt: ['Custom field numeric must be entered'] },
  WCF8502: { t: 'Custom field group must be entered' },
  WCF8503: { t: 'Custom field group &1 does not exist' },
  WCOB701: { t: 'Controlling object &1 is invalid' },
  WCOTB03: { t: 'Condition table &1 does not exist' },
  WCU0203: { t: 'Customer number &1 does not exist' },
  WDE0403: { t: 'Department &1 does not exist' },
  WDL0202: { t: 'Delivery number must be entered' },
  WDL0203: { t: 'Delivery number &1 does not exist', alt: ['Delivery number does not exist'] },
  WDL0701: { t: 'Planned delivery date &1 is invalid' },
  WDL0801: { t: 'Time of delivery &1 is invalid' },
  WDL1801: { t: 'Changed delivery &1 is invalid' },
  WDN2001: { t: 'Delivery note date &1 is invalid' },
  WDN2002: { t: 'Delivery note date must be entered' },
  WDN2201: { t: 'Delivery note time &1 is invalid' },
  WDS0101: { t: 'Status proposal &1 is invalid' },
  WDSD101: { t: 'Departure date &1 is invalid' },
  WE00A03: { t: 'Partner &1 does not exist' },
  WE03501: { t: 'Test indicator &1 is invalid' },
  WE06502: { t: 'Message type must be entered', alt: ['Message Type must be entered'] },
  WEEQN04: { t: 'Equipment number reference &1 already exists' },
  WEQ0403: { t: 'Equipment type &1 does not exist' },
  WEQ0503: { t: 'Equipment group &1 does not exist' },
  WEQ1B04: { t: 'Equipment no &1 already exists' },
  WEQCL03: { t: 'Equipment class &1 does not exist' },
  WEX2501: { t: 'Expiration date &1 is invalid' },
  WFA3103: { t: 'Fixed asset type &1 does not exist' },
  WFAC302: { t: 'Facility must be entered' },
  WFAC303: { t: 'Facility &1 does not exist' },
  WGED101: { t: 'Date generated &1 is invalid' },
  WGED102: { t: 'Date generated must be entered' },
  WGR0601: { t: 'Package number &1 is invalid' },
  WGR0603: { t: 'Package number &1 does not exist' },
  WGR0803: { t: 'Goods receiving method &1 does not exist' },
  WHL0401: { t: 'Holder &1 is invalid' },
  WHVDT01: { t: 'Harvested date &1 is invalid' },
  WICDN01: { t: 'Customs import declaration number &1 is invalid', alt: ['Import declaration number &1 is invalid'] },
  WICDN03: { t: 'Customs import declaration number &1 does not exist' },
  WIND401: { t: 'Lot control method &1 is invalid' },
  WIT0101: { t: 'Item no &1 is invalid', alt: ['Item &1 does not exist', 'Item number &1 is invalid'] },
  WIT0102: { t: 'Item number must be entered', alt: ['Item number &1 does not exist'] },
  WIT0103: { t: 'Item number &1 does not exist' },
  WLKST01: { t: 'Like kind status &1 is invalid' },
  WLPC102: { t: 'Potency must be entered' },
  WMF1203: { t: 'Manufacturing order number &1 does not exist' },
  WMF4901: { t: 'Manufacturing date &1 is invalid' },
  WMO0101: { t: 'Delivery method &1 is invalid' },
  WMO0103: { t: 'Delivery method &1 does not exist' },
  WMRCT01: { t: 'Manual reclassification time &1 is invalid' },
  WMREC01: { t: 'Manual reclassification date &1 is invalid' },
  WMS3703: { t: 'Message number &1 does not exist' },
  WMS3804: { t: 'Message Number &1 already exists' },
  WMS3902: { t: 'External message number must be entered' },
  WMS4003: { t: 'Message line number &1 does not exist' },
  WMS4301: { t: 'Qualifier &1 is invalid' },
  WMS4302: { t: 'Qualifier must be entered' },
  WMS4303: { t: 'Qualifier &1 does not exist' },
  WMS5003: { t: 'Connected function &1 does not exist' },
  WMUAV01: { t: 'Multiple attribute values &1 is invalid' },
  WOE0101: { t: 'Flagged as completed &1 is invalid' },
  WOR0303: { t: 'Customer order number &1 does not exist' },
  WOWTP01: { t: 'Owner type &1 is invalid', alt: ['Ownership type &1 is invalid'] },
  WPA0903: { t: 'Packaging &1 does not exist' },
  WPA2501: { t: 'Included in package number &1 is invalid' },
  WPA5103: { t: 'Package number &1 does not exist' },
  WPL0203: { t: 'Work center &1 does not exist' },
  WPL0301: { t: 'Resourcetype &1 is invalid' },
  WPL1803: { t: 'Picking list suffix &1 does not exist' },
  WPN0101: { t: 'Purchase order line &1 is invalid' },
  WPN0103: { t: 'Purchase order line &1 does not exist' },
  WPO0301: { t: 'Order line number &1 is invalid' },
  WPO0303: { t: 'Order line number &1 does not exist' },
  WPO0403: { t: 'Alias number &1 does not exist' },
  WPPNB03: { t: 'pre-pack number &1 does not exist' },
  WPR2101: { t: 'Manufacturer &1 is invalid' },
  WPR2103: { t: 'Manufacturer &1 does not exist' },
  WPU0201: { t: 'Purchase order U/M &1 is invalid' },
  WPU0803: { t: 'Purchase order number &1 does not exist' },
  WPU0901: { t: 'Lowest status - purchase order &1 is invalid' },
  WRCD101: { t: 'Receipt date &1 is invalid' },
  WRCD501: { t: 'Receipt time &1 is invalid' },
  WRD1901: { t: 'Received Time &1 is invalid' },
  WRE0103: { t: 'Responsible &1 does not exist' },
  WRI0102: { t: 'Purchase order number must be entered', alt: ['Order number must be entered'] },
  WRI0103: { t: 'Purchase order number &1 does not exist' },
  WRP3501: { t: 'Reporting time &1 is invalid' },
  WRV0302: { t: 'Received quantity must be entered' },
  WSE1701: { t: 'Serial number invalid' },
  WSE1702: { t: 'Serial number must be entered' },
  WSE1704: { t: 'Serial number &1 already exists' },
  WSE4402: { t: 'Serial number must be entered' },
  WSE4403: { t: 'Serial number &1 does not exist' },
  WSH3001: { t: 'Requested departure date &1 is invalid' },
  WSH3101: { t: 'Requested departure time &1 is invalid' },
  WSN1A01: { t: 'Serial number return code &1 is invalid' },
  WSP0401: { t: 'Issue method &1 is invalid' },
  WSPTB03: { t: 'Specification table &1 does not exist' },
  WSQ0602: { t: 'Sequence number must be entered' },
  WST0301: { t: 'Status &1 is invalid' },
  WSTA101: { t: 'Status - balance ID &1 is invalid' },
  WSU0101: { t: 'Supplier number &1 is invalid', alt: ['Supplier &1 is invalid'] },
  WSU0102: { t: 'Supplier number must be entered' },
  WSU0103: { t: 'Supplier number &1 does not exist', alt: ['Supplier does not match PO'] },
  WSU2101: { t: 'Supplier type &1 is invalid' },
  WSUD202: { t: 'Delivery note number must be entered' },
  WTA1A04: { t: 'Registration number/site &1 already exists' },
  WTE0101: { t: 'Delivery terms &1 is invalid' },
  WTE0103: { t: 'Delivery terms &1 does not exist' },
  WTR0901: { t: 'Order number &1 is invalid' },
  WTR0903: { t: 'Order number &1 does not exist' },
  WTRD101: { t: 'Transaction date &1 is invalid' },
  WTT0403: { t: 'Order type &1 does not exist' },
  WTW0402: { t: 'To location must be entered' },
  WUS0503: { t: 'User &1 does not exist' },
  WWH0101: { t: 'Warehouse &1 is invalid' },
  WWH0102: { t: 'Warehouse must be entered' },
  WWH0103: { t: 'Warehouse &1 does not exist' },
  WWO0201: { t: 'Reporting number &1 is invalid' },
  WWO0203: { t: 'Reporting number &1 does not exist' },
  WWS0101: { t: 'Location &1 is invalid' },
  WWS0102: { t: 'Location must be entered' },
  WWS0103: { t: 'Location &1 does not exist' },
  XAD0001: { t: 'A record has been entered by user &1' },
  XBA0003: { t: 'Lot no. &1 does not exist for item no. &2 in the lotfile' },
  XDE0001: { t: 'The record has been deleted by another user' },
  XDT0001: { t: 'Incorrect date' },
  XIM0039: { t: 'Order line does not exist' },
  XIT0107: { t: 'Item number is not permitted - status is &1' },
  XMB9730: { t: 'The allocation attribute did not match demand' },
  XMO0041: { t: 'The operation status is &1. A change is not permitted' },
  XMO0047: { t: 'Work order status is &1. Option &2 is not permitted' },
  XNU0000: { t: 'Numeric error' },
  XNU0003: { t: 'Negative value is not permitted' },
  XOPC001: { t: 'Invalid operation code &1' },
  XO_1130: { t: 'Please try again later' },
  XPC0001: { t: 'The lot has potency &1' },
  XPO0002: { t: 'The status of the PO line is &1, change is not permitted' },
  XRE0103: { t: 'Record does not exists', alt: ['Record does not exist'] },
  XRE0104: { t: 'Record already exists', alt: ['Record already exist'] },
  XST0020: { t: 'Status change are not permitted any longer' },
  XUP0001: { t: 'The record has been changed by user &1' },
  X_00200: { t: 'The identifier may not contain a restricted character: &1' },
  X_01003: { t: 'User &1 is not active' },
};

export function lookupMiMessage(code: string | null | undefined): MiMessage | null {
  if (!code) return null;
  const key = String(code).trim().toUpperCase();
  return Object.prototype.hasOwnProperty.call(MI_MESSAGES, key) ? MI_MESSAGES[key] : null;
}

/**
 * The operator-facing sentence for a code, or '' when unknown.
 *
 * Unfilled `&1` placeholders are stripped: M3 substitutes them itself, so one
 * surviving here means the text came from this table, and "Location does not
 * exist" reads better than "Location &1 does not exist".
 */
export function describeMiMessage(
  code: string | null | undefined,
  substitutions?: string[]
): string {
  const entry = lookupMiMessage(code);
  if (!entry) return '';

  let text = entry.t;
  if (substitutions) {
    for (let i = 0; i < substitutions.length; i++) {
      const value = substitutions[i];
      if (value === undefined || value === null || value === '') continue;
      text = text.split('&' + (i + 1)).join(String(value));
    }
  }
  text = text.replace(/&\d/g, '').replace(/\s{2,}/g, ' ').trim();
  if (!text) return '';
  return entry.cut ? text + '…' : text;
}

/**
 * Whether `message` already says what the catalogue would say, so the dialog
 * does not print both. Compared on letters and digits only, because M3 fills in
 * `&1` and may punctuate differently.
 */
export function messageMatchesCatalogue(
  code: string | null | undefined,
  message: string | null | undefined
): boolean {
  const entry = lookupMiMessage(code);
  if (!entry || !message) return false;

  const normalise = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const actual = normalise(message);
  if (!actual) return false;

  const candidates = [entry.t].concat(entry.alt || []);
  for (let i = 0; i < candidates.length; i++) {
    const parts = candidates[i].split(/&\d/).map(normalise).filter((p) => p.length > 3);
    if (parts.length && parts.every((p) => actual.indexOf(p) !== -1)) return true;
  }
  return false;
}

export function miMessageCount(): number {
  return Object.keys(MI_MESSAGES).length;
}
