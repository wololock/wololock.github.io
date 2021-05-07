'use strict';

const fs = require('fs');
const path = require('path');

module.exports = (hexo) => {
    const ad_single = function(id, banners) {
        const ad = banners.ads[id] || {};
        if (ad === undefined) {
            return "";
        }

        const template = fs.readFileSync(path.resolve(__dirname, '../../../templates/ad.pug'), 'utf-8');
        return hexo.render.renderSync({ text: template, engine: "pug" }, {ad: ad, id: id});
    };

    const ad_campaign = function(id, banners) {
        const campaign = banners.campaigns[id] || {};
        if (campaign === undefined) {
            return "";
        }

        const ads = campaign.ads
            .map(it => Array(it[1]).fill(it[0]))
            .flat()
            .shuffle()

        return ad_single(ads[0], banners);
    };

    hexo.extend.helper.register('ad_single', function(id){
        return ad_single(id, this.site.data.banners)
    });

    hexo.extend.tag.register('ad_single', function(id){
        return ad_single(id, this.site.data.banners)
    });

    hexo.extend.helper.register('ad_campaign', function(id){
        return ad_campaign(id, this.site.data.banners)
    });

    hexo.extend.tag.register('ad_campaign', function(id){
        return ad_campaign(id, this.site.data.banners)
    });
};