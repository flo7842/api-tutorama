

module.exports = function checkEmailAndPassword(req, res, next)  {
    try {
        const { email, password } = req.body

        const regex = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
        if (email === undefined || !regex.test(email.trim()))
            return res.status(401).json({ error: true, message: 'L\'adresse email n\'est pas au bon format, veuillez réesayer avec un format valide !'})
        else if (password === undefined || password.length < 4)
            return res.status(401).json({ error: true, message: 'Error password' })
        else
            next()

    } catch (err) {
        return res.status(500).json({ error: true, message: 'Error server' })
    }
}
