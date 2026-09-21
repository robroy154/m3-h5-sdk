/**
 * Per-deployment configuration, read from the H5 script argument string.
 *
 * This is what makes the asset customer-agnostic. V6 compiled Benco's
 * warehouse group, CMS474 custom field and currency into the source, which is
 * exactly what stops a script being reusable. Nothing tenant-specific has a
 * default here: a value is either supplied, or the feature it drives is
 * skipped, or the script refuses to run.
 *
 * Format is comma-separated `key:value`, order-independent, every key
 * omittable:
 *
 *     wms:true,whgr:WMSWHSE,e065:WMS,maxserials:25
 *
 * BEN_H5_AutoComplete uses positional arguments, but with a dozen optional
 * settings that degrades into runs of empty commas where a mis-ordered value
 * fails silently. Keys are worth the small departure.
 */

export interface ReceiptConfig {
  /** Warn when receiving into a WMS-managed warehouse outside WMS. */
  wmsCheckEnabled: boolean;
  /** MMS009 warehouse group identifying WMS warehouses. Only used when enabled. */
  warehouseGroup: string;

  /* MHS850MI/AddWhsHead partner keys. These five identify the MMS865 partner
     record M3 resolves. Defaults are the record M3 ships, so no customer has
     to create one; override them together, not individually. */
  partnerA: string;
  partnerB: string;
  partnerQualifierA: string;
  partnerQualifierB: string;
  messageType: string;

  /** Upper bound on serials collected in one dialog. */
  maxSerials: number;

  /* CMS474 custom field, only needed for a serial longer than EEQN's 40
     characters. Blank means "not configured", which is legal until such a
     serial actually turns up. */
  customFieldGroup: string;
  customFieldName: string;
  customFieldSequence: string;
}

export const DEFAULT_CONFIG: ReceiptConfig = {
  wmsCheckEnabled: false,
  warehouseGroup: '',
  partnerA: 'WS',
  partnerB: 'WS',
  partnerQualifierA: '',
  partnerQualifierB: '',
  messageType: 'WMS',
  maxSerials: 25,
  customFieldGroup: '',
  customFieldName: '',
  customFieldSequence: '1',
};

export interface ConfigResult {
  config: ReceiptConfig;
  /** Fatal: the script must not run. */
  errors: string[];
  /** Non-fatal, worth logging — typos in the argument string. */
  unknownKeys: string[];
}

const KNOWN_KEYS = [
  'wms', 'whgr', 'e0pa', 'e0pb', 'e0qa', 'e0qb', 'e065',
  'maxserials', 'cfmg', 'cfmf', 'sqnr',
];

/** Splits the raw argument string. Unparseable pairs are ignored, not guessed at. */
export function parseArgumentString(raw: string): Record<string, string> {
  const values: Record<string, string> = {};
  if (!raw) return values;

  for (const pair of raw.split(',')) {
    const separator = pair.indexOf(':');
    if (separator < 1) continue; // no key, or no separator at all
    const key = pair.slice(0, separator).trim().toLowerCase();
    const value = pair.slice(separator + 1).trim();
    if (key) values[key] = value;
  }
  return values;
}

function parseBoolean(value: string): boolean {
  const v = (value || '').toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

/**
 * Builds the config, reporting anything that makes the script unsafe to run.
 *
 * The only fatal case at startup is asking for the WMS check without naming
 * the warehouse group — enabling a check against an unnamed group would either
 * do nothing or match the wrong warehouses. Everything else degrades: an
 * omitted feature is skipped, not guessed.
 */
export function buildConfig(raw: string): ConfigResult {
  const values = parseArgumentString(raw);
  const errors: string[] = [];
  const unknownKeys = Object.keys(values).filter(
    (k) => KNOWN_KEYS.indexOf(k) === -1
  );

  const config: ReceiptConfig = {
    wmsCheckEnabled: parseBoolean(values.wms),
    warehouseGroup: values.whgr || '',
    partnerA: values.e0pa || DEFAULT_CONFIG.partnerA,
    partnerB: values.e0pb || DEFAULT_CONFIG.partnerB,
    partnerQualifierA: values.e0qa || '',
    partnerQualifierB: values.e0qb || '',
    messageType: values.e065 || DEFAULT_CONFIG.messageType,
    maxSerials: DEFAULT_CONFIG.maxSerials,
    customFieldGroup: values.cfmg || '',
    customFieldName: values.cfmf || '',
    customFieldSequence: values.sqnr || DEFAULT_CONFIG.customFieldSequence,
  };

  if (values.maxserials !== undefined) {
    const parsed = Number(values.maxserials);
    if (!Number.isInteger(parsed) || parsed < 1) {
      errors.push(
        'maxserials must be a whole number of 1 or more (got "' +
          values.maxserials + '").'
      );
    } else {
      config.maxSerials = parsed;
    }
  }

  if (config.wmsCheckEnabled && !config.warehouseGroup) {
    errors.push(
      'wms:true requires whgr:<warehouse group>. The group must exist in ' +
        'MMS009 with the WMS warehouses assigned to it.'
    );
  }

  return { config, errors, unknownKeys };
}

/**
 * Whether a serial too long for EEQN can be stored at all.
 *
 * Checked when such a serial appears rather than at startup, so a customer who
 * never receives one never has to configure CMS474.
 */
export function canStoreOversizeSerial(config: ReceiptConfig): boolean {
  return !!(config.customFieldGroup && config.customFieldName);
}
