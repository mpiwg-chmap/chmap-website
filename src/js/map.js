import { MapLayersController } from "@chmap/leaflet-layers-panel";
import { PublicMapsController } from "@chmap/public-maps";
import { DataLayerController } from "@chmap/data-layer";
import { GeoReferencingController } from '@chmap/geo-referencing';

import { Popover } from '@chmap/utilities/src/bootstrp-wrap';

// Load Styles
import '../scss/map.scss';

const initialized = { aboutModal: false };

function initMap() {

    MapLayersController.init();

    const map = MapLayersController.getMap();

    PublicMapsController.init(map);

    DataLayerController.init(map);

    GeoReferencingController.init(map);

}

function initToolbar(){

    const toolbar = document.getElementById('toolbar');

    DataLayerController.hookSidebarToggleBtn(toolbar.querySelector('#sidebar-toggle-btn'));

    // GeoReferencingController.hookSidebarToggleBtn(toolbar.querySelector('#sidebar-toggle-btn'));

    MapLayersController.hookShowMapLayerListTo(toolbar.querySelector('#layers-toggle-btn'));

    const dynamicArea = toolbar.querySelector('#toolbar-dynamic');

    PublicMapsController.addButtonsTo(dynamicArea);

    DataLayerController.addButtonsTo(dynamicArea);

    GeoReferencingController.addButtonsTo(dynamicArea);

}

function initSidebar(){

    const sidebar = document.getElementById('sidebar');

    MapLayersController.bindSidebarEvents(sidebar);

    //Public maps
    new Popover(document.querySelector('.what-is-public-map'), {
        container: 'body',
        trigger: 'hover'
    });

    PublicMapsController.bindTriggerButtons({
        showAllPublicMapsBtn: sidebar.querySelector('#showAllPublicMapsBtn'),
        placeNameFilterBtn: sidebar.querySelector('#placeNameFilterBtn'),
        coordinateFilterBtn: sidebar.querySelector('#coordinateFilterBtn')
    })

    //Import data layer
    DataLayerController.bindTriggerButtons({
        importLocalDataBtn: sidebar.querySelector('#importLocalDataBtn'),
        importOnlineDataBtn: sidebar.querySelector('#importOnlineDataBtn'),
    })

    //Georeferencing
    GeoReferencingController.bindTriggerButtons({
        loadLocalIIIFManifestFileBtn: sidebar.querySelector('#loadLocalIIIFManifestFileBtn'),
        loadOnlineIIIFManifestFileBtn: sidebar.querySelector('#loadOnlineIIIFManifestFileBtn'),
    })

    //User Guide
    sidebar.querySelector('#userGuideBtn')
    .onclick = async (e) => {

        e.preventDefault();

        const { Notification } = await import("@chmap/utilities");

        Notification.show('Under construction ');
    }

    //About
    sidebar.querySelector('#aboutModalBtn')
    .onclick = async (e) => {

        e.preventDefault();

        const { AboutModal } = await import('%/about-modal');

        if(!initialized.aboutModal){
            initAboutModal(AboutModal);
            initialized.aboutModal = true;
        }

        AboutModal.show();
    }

}

function cmpEventBinding(){

    //PublicMapsController events
    PublicMapsController.on('addIntoYourLayer', (layers) => {

        MapLayersController.addIntoYourLayer(layers);

    });

    PublicMapsController.on('filteringModeStart', (filteringMode) => {

        MapLayersController.hideMapLayerList();

    });

    PublicMapsController.on('placeNameSearchEnd', () => {

        MapLayersController.hideMapLayerList();

    });

    //DataLayerController events
    DataLayerController.on('dataFileRead', async (layers) => {

        MapLayersController.hideMapLayerList();

        PublicMapsController.stopFiltering();

        await GeoReferencingController.clear();

    })

    //GeoReferencingController events
    GeoReferencingController.on('iiifManifestFileRead', async (layers) => {

        MapLayersController.hideMapLayerList();

        PublicMapsController.stopFiltering();

        await DataLayerController.clear();

    })

}

function initAboutModal(aboutModal){

    aboutModal.on('citationCopied', async (info) => {

        const { Notification } = await import("@chmap/utilities");

        Notification.show(info);

    });

}

function loadDefaultData(){

    const urlParams = new URLSearchParams(window.location.search);

    const apiURL = (urlParams.get("apiURL") || "").trim();

    if(apiURL !== ''){

        const strRequireCredentials = urlParams.get("requireCredentials") || 'true';

        const requireCredentials = ( strRequireCredentials.toLowerCase() === 'false' ) ? false : Boolean(strRequireCredentials);

        urlParams.delete("apiURL");

        urlParams.delete("requireCredentials");

        const apiURLWithParams = `${apiURL.trim()}?${urlParams.toString()}`;

        DataLayerController.loadFromAPI(apiURLWithParams, requireCredentials);
    }

}

document.addEventListener("DOMContentLoaded", (event) => {

    initMap();

    initToolbar();

    initSidebar();

    cmpEventBinding();

    loadDefaultData();

});
