import { Commons, BootstrapWrap } from "@chmap/utilities";

const { Modal } = BootstrapWrap;

const AboutModal = function() {

    const localEventEmitter = new Commons.EventEmitterClass();

    let modal = null;

    function addEventListener(obj, types, fn, context) {
        localEventEmitter.on(obj, types, fn, context);
    }

    function creat() {

        const html =
`<div class="modal-dialog modal-xl" >
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Land Survey Maps of China: A Cartographic Database (1895-1944)</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body" style="font-size: 11pt;">
        <img src='images/map/MPIWG_kuerzel_rgb.png' style='border:10px solid #ffffff;float: left;' />
        <p>
            This cartographic database provides digitized land survey maps of China produced in the late 19th and early 20th
            centuries. From the last decades of the Qing dynasty (1644-1911) to the end of the Republican era (1912-1949), 
            China’s central and provincial governments and the Land Survey Department of the Japanese Army conducted
            geographical surveys across China and produced maps that contain detailed information on topographical and administrative
            features. Over 4,000 of these land survey maps of China were compiled and published by the Japanese publisher Kagaku
            Shoin between 1986 and 1998. With the support of Kagaku Shoin, the Max Planck Institute for the History of Science (MPIWG)
            and the Department of History, Shanghai Jiao Tong University (SJTU) have jointly curated, digitized, 
            and georeferenced the published maps and have created a unique open-access cartographic database that allows users to
            seamlessly incorporate historical maps into any GIS mapping software. We have also included maps 
            that have been digitized and georeferenced by Academia Sinica in Taiwan.
        </p>
        <p>
            This database brings together all historical land survey maps of China that
            are currently accessible and allows users to
            cross-reference them on a single web-based user interface. Users can export map layers to desktop- or
            web-based GIS tools by using WMTS (<a href="https://en.wikipedia.org/wiki/Web_Map_Tile_Service" target="_blank">Web Map Tile Service</a>) URLs.
            For instructions on how to export map layers, please follow this <a href="files/manual.pdf" target="_blank">link</span></a>.
            Users are welcome to use the maps provided in this database for research purposes under the 
            <a rel="license" target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0 license</a>.
            <a rel="license" target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                <img alt="Creative Commons License" style="vertical-align:middle;border-width:0"
                    src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" />
            </a>
        </p>
        <p>Sources:
            <ol> 
                <li>Chūgoku tairiku gomanbun no ichi chizu shūsei 中国大陸五万分の一地図集成 (Collection of 1:50,000 maps of China). 8 vols.
                    Tokyo: Kagaku Shoin, 1986-1998. (MPIWG Dataset: 1885-1945, 1:50,000) Between 1986 and 1998, Kagaku Shoin
                    published 4,088 land survey maps of China held in archives in Japan and the United States. 
                    This collection contains maps of nineteen provinces: Fujian, Guangdong, Guangxi, Guizhou, Yunnan, Hainan, 
                    Hebei, Hubei, Hunan, Jiangsu, Jiangxi, Liaoning, Shanxi, Zhejiang, Anhui, Henan, Inner Mongolia, Shaanxi, and Sichuan.
                </li>
                <li>
                    Center for GIS, Research Center for Humanities and Social Sciences, Academia Sinica: Academia Sinica
                    holds approximately 2,000 land survey maps of China produced in the late 19th and early 20th centuries, 
                    a portion of which has been digitized and made publicly available via WMTS. 
                    Maps of seven provinces (Anhui, Fujian, Hebei, Henan, Jiangsu, Shandong, and Zhejiang) are included 
                    in this database for reference purposes.
                </li>
            </ol>
            <h6>Citation:</h6>
            <p id="citation-text" style="font-size:8pt;">
                <span>Paper Citation in APA</span>:<br />
                <a target="_blank" href="https://www.euppublishing.com/doi/full/10.3366/ijhac.2020.0246">
                    Lin, N. Y., Chen, S. P., Wang, S., & Yeh, C. (2020). 
                    Displaying spatial epistemologies on web GIS: using visual materials from the Chinese local gazetteers as an example. 
                    International Journal of Humanities and Arts Computing, 14(1-2), 81-97.
                </a><br />
                Web Site Citation in APA:<br /> 
                The Max Planck Institute for the History of Science, The Department of History of Shanghai Jiao Tong University. 
                Land Survey Maps of China: A Cartographic Database (MPIWG Dataset: 1885-1945, 1:50,000), 
                The General Administration of Land Surveys. https://chmap.mpiwg-berlin.mpg.de. Published 2019.
            </p>
      </div>
      <div class="modal-footer">
        <button type="button" 
                class="btn btn-primary import-btn copyCitation-btn">
            Copy Citation
        </button>
      </div>
    </div>
 </div>`;

        const div = document.createElement('div');

        div.className = 'modal fade';
        div.innerHTML = html;

        document.body.append(div);

        div.querySelector('.copyCitation-btn').onclick = copyCitation;

        modal = Modal.getOrCreateInstance(div);

    }

    function copyCitation(e) {

        e.preventDefault();

        const text = document.getElementById('citation-text').innerText;

        navigator.clipboard.writeText(text).then(
        () => localEventEmitter.emit('citationCopied', 'Citation copied')
        );

    }

    function show() {

        if (!modal) {
            creat();
        }

        modal.show();

    }

// function hide() {
//
//     if(modal) {
//         modal.hide();
//     }
//
// }

    return {
        show,
        on: addEventListener,
    }

    /* Events

    { name: 'citationCopied', params: String }

    */
}();

export { AboutModal };


