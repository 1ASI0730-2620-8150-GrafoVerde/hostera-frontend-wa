import { BaseApi } from '../../shared/infrastructure/base-api.js';

const hosteraPlatformApiUrl = import.meta.env.VITE_HOSTERA_PLATFORM_API_URL;
const propertyOverviewsEndpointPath = import.meta.env
  .VITE_PROPERTY_OVERVIEWS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Overview bounded-context endpoints of the Hostera Platform.
 *
 * @class OverviewApi
 * @extends BaseApi
 */
export class OverviewApi extends BaseApi {
  /** Creates the HTTP client of the Hostera Platform. */
  constructor() {
    super(hosteraPlatformApiUrl);
  }

  /**
   * Fetches the overview of every property on a day.
   * @param {string} date - ISO calendar day of the overviews.
   * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the property overviews' response.
   */
  getPropertyOverviews(date) {
    return this.http.get(propertyOverviewsEndpointPath, { params: { date } });
  }
}
