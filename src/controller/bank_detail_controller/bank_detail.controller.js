// controllers/bankController.js
const db = require("../../../config/db.config");
const BankDetails = db.bank_details;

async function saveBankDetails(req, res) {
    try {
        const {
            astro_id,
            pan_card_no,
            aadhar_no,
            acc_no,
            acc_holder_name,
            ifsc_code,
            bank_name,
            pan_doc,
            aadhar_doc,
            passbook_img,
        } = req.body;

        const detailsExists = await BankDetails.findOne({
            where: { astro_id: astro_id },
        });

        const fileUpload = async (file, fieldName) => {
            if (file) {
                const filePath = 'public\images'; // Update the path
                const fileName = `/${Date.now()}${file.name}`;
                await file.mv(filePath + fileName);
                return fileName;
            }
            return null;
        };

        if (detailsExists) {
            const updateData = {
                pan_card_no,
                aadhar_no,
                acc_holder_name,
                ifsc_code,
                acc_no,
                bank_name,
                aadhar_doc,
                pan_doc,
                passbook_img,
            };

            updateData.pan_doc = await fileUpload(req.body.pan_doc, 'pan_doc');
            updateData.aadhar_doc = await fileUpload(req.body.aadhar_doc, 'aadhar_doc');
            updateData.passbook_img = await fileUpload(req.body.passbook_img, 'passbook_img');

            await BankDetails.update(updateData, {
                where: { astro_id },
            });

            return res.json({
                status: true,
                data: updateData,
                message: 'Documents updated successfully',
            });
        } else {
            const insertData = {
                astro_id,
                pan_card_no,
                aadhar_no,
                acc_no,
                acc_holder_name,
                ifsc_code,
                bank_name,
                pan_doc: await fileUpload(req.body.pan_doc, 'pan_doc'),
                aadhar_doc: await fileUpload(req.body.aadhar_doc, 'aadhar_doc'),
                passbook_img: await fileUpload(req.body.passbook_img, 'passbook_img'),
            };

            await BankDetails.create(insertData);

            return res.json({
                status: true,
                data: insertData,
                message: 'Bank Details saved successfully',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            code: 500,
            message: 'Internal Server Error',
            data: '',
        });
    }
}

module.exports = {
    saveBankDetails,
};
