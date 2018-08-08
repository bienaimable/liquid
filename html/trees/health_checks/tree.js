import * as Elements from "../../static/js/cards/elements.js"
import * as Helpers from "../../static/js/cards/helpers.js"


export let nodes = {}
//// (Optional) Adding external nodes
//import * as SpendTree from "../spend/tree.js"
//nodes = Object.assign(nodes, SpendTree.nodes)

nodes = Object.assign(nodes, {
    'home': async (variables, callback) => {
        try {
            let card = {
                title: "General Account Health",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: "",
                },
                buttons: [
                    {name: "Begin", destination: 'client'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'client': async (variables, callback) => {
        try {
            let url = "http://settings.oea.criteois.lan/api/v1/topWs/advertisers/GetAdvertisers?limit=0"
            let json = await Helpers.download(url)
            let advertisers = Object.keys(json).map(key => key + " - " + json[key])
            let card = {
                title: "Client",
                element: Elements.AutocompleteInput, 
                element_parameters: {
                    label: "Client",
                    variable: "client",
                    data: advertisers,
                },
                buttons: [
                    {name: "Next", destination: 'partner'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'partner': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let url = `http://watson.oea.criteois.lan/api/v1/query/sherlock/partner_lookup?client_id=${client_id}`
            let json = await Helpers.watson_download(url)
            let partners = json.results.map(
                result => result.partner_id + " - " + result.partner_name )
            let card = {
                title: "Partner",
                element: Elements.AutocompleteInput, 
                element_parameters: {
                    label: "Partner",
                    variable: "partner",
                    data: partners,
                },
                buttons: [
                    {name: "Next", destination: 'homepage_url'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'homepage_url': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/partners/GetPartner?partnerId=${partner_id}&allData=false`
            let json = await Helpers.download(url)
            let homepage_url = json.logoUrl
            let description = ``
            if (homepage_url) {
                description = `The following homepage URL is set up for this account: ${homepage_url}` }
            else {
                description = `No homepage URL has been set on this account. This may reduce performance if users are unable to click on some parts of the banners.`}
            let card = {
                title: "Homepage URL",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                buttons: [
                    {name: "Change homepage URL", destination: 'change_homepage_url'},
                    {name: "Continue", destination: 'logo_image_url'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'change_homepage_url': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `https://top.criteo.com/app/#/PartnerEdit/partner/${partner_id}`
            let description = `Change URL here: ${url}`
            let card = {
                title: "",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                buttons: [
                    {name: "Continue", destination: 'confirm_homepage_url'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'confirm_homepage_url': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/partners/GetPartner?partnerId=${partner_id}&allData=false`
            let json = await Helpers.download(url)
            let homepage_url = json.logoUrl
            let description = ``
            if (homepage_url) {
                description = `The URL is now set up to: ${homepage_url}` }
            else {
                description = `No homepage URL has been set on this account. This may reduce performance if users are unable to click on some parts of the banners.`}
            let card = {
                title: "",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Continue", destination: 'logo_image_url'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'logo_image_url': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/partners/GetPartner?partnerId=${partner_id}&allData=false`
            let json = await Helpers.download(url)
            let logo_image_url = json.urlLogo
            let description = ``
            if (logo_image_url) {
                description = `The following logo image is set up for this account: ${logo_image_url}` }
            else {
                description = `No logo image has been set on this account. This may be a problem for dynamic banners and on the opt-out pages.`}
            let card = {
                title: "Logo Image",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'cross_device_enabled'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cross_device_enabled': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/partners/GetPartner?partnerId=${partner_id}&allData=false`
            let json = await Helpers.download(url)
            let cross_device_enabled = json.xDeviceDisabled
            let description = ``
            if (cross_device_enabled) {
                description = `As expected cross device is enabled.` }
            else {
                description = `Cross device has been disabled on this partner. Criteo then can't use hashed email addresses and other available user IDs to match devices together. It also means cross-device recommendation and segmentation is disabled.`}
            let card = {
                title: "Cross Device",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'ebs_enabled'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'ebs_enabled': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/partners/GetPartner?partnerId=${partner_id}&allData=false`
            let json = await Helpers.download(url)
            let extended_browser_support_enabled = json.ebsActive
            let description = ``
            if (extended_browser_support_enabled) {
                description = `As expected Extended Browser Support (EBS) is enabled.` }
            else {
                description = `Extended Browser Support (EBS) has been disabled on this partner. Criteo then can't retarget Safari users on desktop and mobile, which will affect performance.`}
            let card = {
                title: "Extended Browser Support",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'cross_device_sales'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'cross_device_sales': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/advertisers/Get?id=${client_id}&withDetails=true`
            let json = await Helpers.download(url)
            let ignore_cross_device_sales = json.ignoreCrossDeviceSales
            let description = ``
            if (ignore_cross_device_sales) {
                description = `This account is not configured for cross device sales. Only sales that happen on the device that generated the click will be counted. This will reduce the number of sales Criteo attributes to itself and limit cross-device efficiency.`}
            else {
                description = `This account is configured for cross device sales. Regardless of what device is used by the user to click and convert, the sale will be properly counted. This means cross-device is used efficiently.`}
            let card = {
                title: "Cross Device Sales",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'filler_campaign'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'filler_campaign': async (variables, callback) => {
        try {
            let client_id = variables.client.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/advertisers/Get?id=${client_id}&withDetails=true`
            let json = await Helpers.download(url)
            let filler_campaign = json.isFiller
            let description = ``
            if (filler_campaign) {
                description = `This advertiser is set up as a 'filler'. This should only be the case for non-standard campaigns that are usually set up by the publisher team. This is not expected if the account is a regular client.` }
            else {
                description = `As expected, this advertiser is not set as 'filler'. Filler campaigns are only for non-standard campaigns usually set up by the publisher team.`}
            let card = {
                title: "Filler Setting",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'number_of_comments'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'number_of_comments': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/comments/Get?partnerId=${partner_id}`
            let json = await Helpers.download(url)
            let description = ``
            if (json.length) {
                description = `There are ${json.length } comments describing what happened on this partner. Comments helps store important information and bring context.` }
            else {
                description = `There are no comments describing what happened on this partner. It means there is less context to help during account transition.` }
            let card = {
                title: "Number of Comments",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'rtb_cross_matched_impression'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'rtb_cross_matched_impression': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/partners/GetPartner?partnerId=${partner_id}&allData=false`
            let json = await Helpers.download(url)
            let cross_match_refused = json.xMatchRefused
            let description = ``
            if (cross_match_refused) {
                description = `Cross-matched impressions provided by RTB networks are refused on this account. Criteo will only rely on its own cross-device matches, which can reduce the number of impressions.`}
            else {
                description = `Cross-matched impressions provided by RTB networks are accepted on this account. Criteo will use the device matches from these third parties.`}
            let card = {
                title: "RTB Cross Matched Impressions",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'facebook_terms_and_conditions'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'facebook_terms_and_conditions': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/partners/GetPartner?partnerId=${partner_id}&allData=false`
            let json = await Helpers.download(url)
            let terms_signed = json.facebookTAndC
            let description = ``
            if (terms_signed) {
                description = `The Facebook terms and conditions have been accepted by this advertiser. This is necessary to deliver on the Facebook platform.`}
            else {
                description = `The Facebook terms and conditions have not been accepted by this advertiser. This will prevent the account from delivering on the Facebook platform.`}
            let card = {
                title: "Facebook Terms and Conditions",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'all_campaigns_in_ab_test'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'all_campaigns_in_ab_test': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/campaigns/GetAllCampaignsDataFor?type=partner&id=${partner_id}&withDetails=true`
            let json = await Helpers.download(url)
            let campaigns = json.campaigns
            let ab_test_active = campaigns.some(x => x.isInABTest)
            let ab_test_consistent = campaigns.every(x => x.isInABTest === campaigns[0])
            let description = ``
            if (ab_test_active && ab_test_consistent) {
                description = `An AB test is currently running on this partner. All campaigns are correctly added to the AB test.`}
            else if (ab_test_active) {
                description = `An AB test is currently running on this partner. Unfortunately, some campaigns haven't been correctly added to the AB test, which may create problems.`}
            else {
                description = `No AB test is running on this partner.`}
            let card = {
                title: "AB Test",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'dising_settings'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'dising_settings': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/partners/GetPartner?partnerId=${partner_id}&allData=false`
            let json = await Helpers.download(url)
            let description = `Publisher pixels called
                on Desktop: ${json.disingOnDesktop}
                on Mobile: ${json.disingOnMobile}
                on Tablet: ${json.disingOnTablet}
                Pixel timeout: ${json.disingTimeOut} seconds

            `
            let default_settings = json.disingOnDesktop == 30 
                                    && json.disingOnTablet == 30 
                                    && json.disingOnMobile == 5 
                                    && json.disingTimeOut == 5000 
            if (default_settings) {
                description = description.concat(`These are the default values`)}
            else {
                description = description.concat(`Some of these values differ from the normal settings. Low values could prevent this account from reaching some users.`)}
            let card = {
                title: "Publisher pixels settings",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'last_import_date'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'last_import_date': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/partner/${partner_id}/import?clients=catalog&limit=16&startIndex=0`
            let json = await Helpers.download(url)
            let max_date = json.map(x => x.finishedPersistingTimestamp).sort().slice(-1)[0]
            let hours_since = moment().diff(max_date, 'hours')
            console.log(max_date)
            console.log(hours_since)
            let description = ``
            if (hours_since >= 24) {
                description = description.concat(`It's been more than ${hours_since} hours since the last successful import. Unless this partner only uses static banners, not updating the catalog regularly can seriously impact performance.`)}
            else {
                description = description.concat(`It's been only ${hours_since} hours since the last successful import. Continuing to update the catalog regularly will allow good performance.`)}
            let card = {
                title: "Last Successful Import",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'feed_safety'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'feed_safety': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/partner/${partner_id}/import?clients=catalog&limit=16&startIndex=0`
            let json = await Helpers.download(url)
            let unsafe_feed = json.blacklistIds
            let description = ``
            if (unsafe_feed) {
                description = description.concat(`Feed is set to 'unsafe' which means the default blacklist for the country will be used during feed import.`)}
            else {
                description = description.concat(`Feed is set to 'safe' which means no filtering will happen during feed import.`)}
            let card = {
                title: "Feed Safety",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'virtual_revenue_mismatch'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'virtual_revenue_mismatch': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/campaigns/GetAllCampaignsDataFor?type=partner&id=${partner_id}&withDetails=true`
            let json = await Helpers.download(url)
            let no_revenue_mismatch = json.campaigns.every(x => x.revenueValue === x.virtualRevenueValue)
            let description = ``
            if (no_revenue_mismatch) {
                description = description.concat(`Virtual CPC/CPM is aligned with actual CPC/CPM for all campaigns of this partner. This prevents misleading the engine.`)}
            else {
                description = description.concat(`Virtual CPC/CPM is not aligned with actual CPC/CPM for some campaigns of this partner. The engine may make erroneous predictions and create negative margins.`)}
            let card = {
                title: "Virtual Revenue",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'impression_capping'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'impression_capping': async (variables, callback) => {
        try {
            let partner_id = variables.partner.split(" - ")[0]
            let url = `http://settings.oea.criteois.lan/api/v1/topWs/campaigns/GetAllCampaignsDataFor?type=partner&id=${partner_id}&withDetails=true`
            let json = await Helpers.download(url)
            let advanced_capping_active = json.campaigns.some(x => x.advancedCapping)
            let description = ``
            if (advanced_capping_active) {
                description = description.concat(`A custom impression capping is in place on at least one campaign of this partner. Custom impression capping can seriously harm performance.`)}
            else {
                description = description.concat(`No custom impression capping is in place on this partner. Custom impression capping can seriously harm performance.`)}
            let card = {
                title: "Custom Impression Capping",
                element: Elements.MessageCard, 
                element_parameters: {
                    label: description,
                },
                autoskip: 5,
                buttons: [
                    {name: "Next", destination: 'end'},
                ],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
    'end': async (variables, callback) => {
        try {
            let card = {
                title: "",
                element: Elements.PrintCard, 
                element_parameters: {
                    label: "End of report.",
                },
                buttons: [],
            }
            callback(card, null)
        } catch(error) {callback(null, error)}
    },
}
)
