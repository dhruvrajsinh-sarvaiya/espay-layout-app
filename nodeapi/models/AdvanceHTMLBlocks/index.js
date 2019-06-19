/**
 * Create By Sanjay 
 * Created Date 04-06-2019
 * Modal For Advance HTML Blocks
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Int32 = require('mongoose-int32');

//Create Schema 
const AdvanceHTMLBlocksSchema = new Schema({
    advancehtmlblockid: Int32,
    name: String,
    status: { type: Int32, default: 0 },// 0 : Active 1: InActive
    type: { type: Int32, default: 1 }, // 1: Tab 2: Panle 3: Modal
    content: {
        tabs: [
            {
                tabtype: { type: Int32, default: 1 },// 1: Vertical 2: Horizontal 
                tabtitle: String,
                tabcontenttype: { type: Int32, default: 1 }, // 1: HTNL Editor 2:Load Content From URL 3:Select Module
                tabcontent: String,
                sortorder: Int32
            }
        ],
        panles: [
            {
                panletitle: String,
                panlecontenttype: { type: Int32, default: 1 }, // 1: HTNL Editor 2:Load Content From URL 3:Select Module
                panlecontent: String,
                sortorder: Int32
            }
        ],
        modals: [
            {
                modaltype: { type: Int32, default: 1 }, // 1: Button 2: Text
                modalcaption: String,
                modaltitle: String,
                modalcontenttype: { type: Int32, default: 1 }, // 1: HTNL Editor 2:Load Content From URL 3:Select Module
                modalcontent: String,
                sortorder: Int32
            }
        ]
    },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports = AdvanceHTMLBlocks = mongoose.model('advancehtmlblocks', AdvanceHTMLBlocksSchema);