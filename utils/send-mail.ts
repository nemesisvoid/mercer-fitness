const nodemailer =require('nodemailer')




const nodemailerConfig ={
    host:process.env.EMAIL_HOST,
    port:process.env.EMAIL_PORT,
    secure:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
}


interface MailOptions{
    from:string,
    to:string,
    subject:string,
    html:string,
}
export const transport = nodemailer.createTransport(nodemailerConfig)


const verifyConnection = async () => {
    try{
        await transport.verify()
        console.log('Nodemailer connection verified')
    }catch(err){
        console.error('Error verifying nodemailer connection', err)
    }
}   

verifyConnection() 


export const sendMail = async({to,subject,html}:MailOptions)=>{
    try{
        await transport.sendMail({
            from:nodemailerConfig.auth.user,
            to,
            subject,
            html,
        })
        console.log('Mail sent successfully')
    }catch(err){
        console.error('Error sending mail', err)
    }
}