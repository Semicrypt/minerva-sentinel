const repository =
require("../repositories/check.repository");

async function getHistory(req,res){

    try{

        const history =
        await repository.getServiceHistory(
            req.params.id
        );

        res.json({

            success:true,

            data:history

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Unable to load history."

        });

    }

}

module.exports={

    getHistory

};