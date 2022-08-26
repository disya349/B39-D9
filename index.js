const express = require('express')

const app = express()
const port = 1000

app.set('view engine', 'hbs')
app.use('/assets', express.static(__dirname + '/assets'))
app.use(express.urlencoded({extended: false}))

const db = require ('./connection/db')

app.get('/', function(request, response){
    db.connect(function(err, client, done){
        if (err) throw err // menampilkan error koneksi database

        client.query('SELECT * FROM tb_blog', function(err, result){
            if (err) throw err // menampilkan error dari query

            console.log(result.rows)
            
            let data = result.rows

            dataFin = data.map (function(item){
                return {
                    ...item,
                    postAt: fullTime(item.postAt),
                    duration: duration(item.start, item.end),
                    author:"Dicki Syafrudin"
                }
            })
            
            response.render('index', {dataBlog: dataFin})
        })
    })
    
})

app.get('/contact', function(request, response){
    response.render('contact')
})

app.get('/blog-detail/:id', function(request, response){    
    let id = request.params.id
    console.log(id);

    let data = dataBlog[id]
    data = {
        title: data.title,
        content: data.content,
        duration: data.duration,
        startDate: data.startDate,
        endDate: data.endDate,
        author: data.author
    }

    response.render('blog-detail', {data})
})

app.get('/add-project', function(request, response){
    response.render('add-project')
})

app.post('/add-project', function(request, response){

    response.redirect('/')
})

app.get('/edit-project/:id', function(request, response){
    let id = request.params.id
    
    let data = {
        title: dataBlog[id].title,
        content: dataBlog[id].content,
        duration: dataBlog[id].duration
    }

    response.render('edit-project', {id, data})
})

app.post('/edit-project/:id', function(request, response){
    response.redirect('/')
})

app.get('/delete-blog/:id', function(request, response){
    let id = request.params.id
    dataBlog.splice(id, 1)

    response.redirect('/')
})

function duration (start,end){

    start = new Date(start)
    end = new Date(end)

    starts = start.getMonth()
    ends = end.getMonth()

    finalDur = ends - starts

    return `${finalDur} month`
}

function fullTime (time){
    let month = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "August", "Sept", "Oct", "Nov", "Dec"]
    
    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    let fixTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`

    return fixTime
}

app.listen(port, function(){
    console.log(`Server running on port ${port}`);
})