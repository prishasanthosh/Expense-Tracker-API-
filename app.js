var express = require("express")
const app = express();

const { v4: uuidv4 } = require("uuid");

app.use(express.json());//middleware to parse json data
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://Prishasanthosh:prishasanthosh@cluster0.udjjrkz.mongodb.net/").then(() => {
    console.log("Connected to database");
})
const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },
});
const Expenses = mongoose.model("Expenses", expenseSchema);

app.get("/api/expenses", async (req, res) => {
    try {
        const expenses = await Expenses.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: "Error in fetching expenses" });
    }
})

app.get("/api/expenses/:id", async (req, res) => {
    try{
        const {id}=req.params;
        const expense=await Expenses.findOne({id:id});
        if(!expense){
            res.status(404).json({message:"Expense not found"});
        }
        res.status(200).json(expense);
        } catch (error) {
            res.status(500).json({ message: "Error in fetching expense" });
        }
})

app.post("/api/expenses", async (req, res) => {
    console.log(req.body);
    const { title, amount } = req.body;
    try {
        const newExpense = new Expenses({
            id: uuidv4(),
            title: title,
            amount: amount
        });
        const savedExpense = await newExpense.save();
        res.status(200).json(savedExpense)
    } catch (error) {
        res.status(500).json({ message: "Error in creating expense" });
    }
});

app.put("/api/expenses/:id",async(req,res)=>{
    const {id}=req.params;
    const {title,amount}=req.body;
    try{
        const updatedExpense=await Expenses.findOneAndUpdate(
        {id},
        {title,amount},
    );
    if(!updatedExpense){
        return res.status(404).json({message:"Expense not found"});
    }
    res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: "Error in updating expense" });
    }
}) 

app.delete("/api/expenses/:id",async(req,res)=>{
    const {id}=req.params;
    try{
        const deletedExpense=await Expenses.findOneAndDelete({id});
        if(!deletedExpense){
            return res.status(404).json({message:"Expense not found"});
        }
        res.status(200).json(deletedExpense);
    } catch (error) {
        res.status(500).json({message:"Error in deleting expense"});
    }
});

// const students=[{
//     name:"Suriya",
//     age:25,
//     rollno:1
// },{
//     name:"Rahul",
//     age:25,
//     rollno:2
// // }]
// app.get("/api/sayhello", (req, res) => {
//     res.send("Hello World");
//     res.end();
// })
// app.get("/api/students", (req, res) => {
//     res.status(200).json(students);
// })
// app.get("/api/students/:rollno", (req, res) => {
//     const { rollno } = req.params;
//     const student = students.find((student) => student.rollno == rollno);
//     if (!student) {
//         res.status(404).send("Student not found");
//     }
//     else {
//         res.status(200).json(student);
//     }
// })
app.listen(3000, () => {
    console.log("Server is running at port 3000");
})