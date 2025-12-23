package com.pext.controller;

import com.pext.controller.BankController;
import com.pext.model.*;
import com.pext.service.UserService;
import com.pext.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.util.Random;

@RestController
public class InitController {
    
    @Autowired
    private BankController bankController;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private SavingGoalRepository savingGoalRepository;
    
    @Autowired
    private LoanRepository loanRepository;
    
    private Random random = new Random();
    
    @PostConstruct
    public void init() {
        // Seed banks on application startup
        bankController.seedBanks();
        
        // Seed demo users if none exist
        seedDemoUsers();
    }
    
    private void seedDemoUsers() {
        // Check if users already exist to avoid duplication
        if (userService.getAllUsersCount() == 0) {
            // Create demo users
            User[] demoUsers = {
                createUser("veerendra vishwakarma", "9876543210", "veerendra@example.com", "password123"),
                createUser("kajal manjhi", "9876543211", "kajal@example.com", "password123"),
                createUser("archana kushwaha", "9876543212", "archana@example.com", "password123"),
                createUser("palak sahu", "9876543213", "palak@example.com", "password123"),
                createUser("rinki baghel", "9876543214", "rinki@example.com", "password123"),
                createUser("vishal vishwakarma", "9876543215", "vishal@example.com", "password123"),
                createUser("nikhil manjhi", "9876543216", "nikhil@example.com", "password123"),
                createUser("amit sharma", "9876543217", "amit@example.com", "password123"),
                createUser("priya patel", "9876543218", "priya@example.com", "password123"),
                createUser("rahul singh", "9876543219", "rahul@example.com", "password123"),
                createUser("sneha gupta", "9876543220", "sneha@example.com", "password123"),
                createUser("rohit mehra", "9876543221", "rohit@example.com", "password123"),
                createUser("anita desai", "9876543222", "anita@example.com", "password123"),
                createUser("sumit kumar", "9876543223", "sumit@example.com", "password123"),
                createUser("poonam verma", "9876543224", "poonam@example.com", "password123"),
                createUser("akash jain", "9876543225", "akash@example.com", "password123"),
                createUser("divya rao", "9876543226", "divya@example.com", "password123"),
                createUser("vikas malhotra", "9876543227", "vikas@example.com", "password123"),
                createUser("nidhi sharma", "9876543228", "nidhi@example.com", "password123"),
                createUser("arjun patel", "9876543229", "arjun@example.com", "password123")
            };
            
            for (User user : demoUsers) {
                User savedUser = userService.createUser(user);
                // Generate realistic demo data for each user
                generateDemoDataForUser(savedUser);
            }
        }
    }
    
    private void generateDemoDataForUser(User user) {
        // Generate 1-3 accounts for each user
        int numAccounts = 1 + random.nextInt(3);
        for (int i = 0; i < numAccounts; i++) {
            Account account = createRandomAccount(user, i + 1);
            Account savedAccount = accountRepository.save(account);
            
            // Generate 5-15 transactions for each account
            int numTransactions = 5 + random.nextInt(11);
            for (int j = 0; j < numTransactions; j++) {
                Transaction transaction = createRandomTransaction(savedAccount, user);
                transactionRepository.save(transaction);
            }
        }
        
        // Generate 0-2 saving goals for each user
        int numSavingGoals = random.nextInt(3);
        for (int i = 0; i < numSavingGoals; i++) {
            SavingGoal savingGoal = createRandomSavingGoal(user, i + 1);
            savingGoalRepository.save(savingGoal);
        }
        
        // Generate 0-2 loans for each user
        int numLoans = random.nextInt(3);
        for (int i = 0; i < numLoans; i++) {
            Loan loan = createRandomLoan(user, i + 1);
            loanRepository.save(loan);
        }
    }
    
    private Account createRandomAccount(User user, int accountNum) {
        Account account = new Account();
        account.setUserId(user.getId());
        
        // Random bank selection
        Long[] bankIds = {1L, 2L, 3L, 4L, 5L, 6L, 7L, 8L, 9L, 10L};
        account.setBankId(bankIds[random.nextInt(bankIds.length)]);
        
        // Generate random account number
        account.setAccountNumber("ACC" + String.format("%06d", user.getId()) + String.format("%02d", accountNum));
        
        // Random account type
        String[] types = {"savings", "checking", "current"};
        account.setType(types[random.nextInt(types.length)]);
        
        // Random balance between $1,000 and $50,000
        double balance = 1000 + (50000 - 1000) * random.nextDouble();
        account.setBalance(String.valueOf(balance));
        
        account.setIsLinked(true);
        account.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(365))); // Random creation date within last year
        
        return account;
    }
    
    private Transaction createRandomTransaction(Account account, User user) {
        Transaction transaction = new Transaction();
        transaction.setAccountId(account.getId());
        
        // Random transaction type
        String[] types = {"credit", "debit"};
        String type = types[random.nextInt(types.length)];
        transaction.setType(type);
        
        // Generate random amount based on transaction type
        double amount;
        if ("credit".equals(type)) {
            amount = 100 + (5000 - 100) * random.nextDouble(); // $100-$5000 for credits
        } else {
            amount = 5 + (2000 - 5) * random.nextDouble(); // $5-$2000 for debits
        }
        transaction.setAmount(String.valueOf(amount));
        
        // Random categories
        String[] categories = {"Food", "Shopping", "Travel", "Bills", "Transfer", "Entertainment", "Others"};
        transaction.setCategory(categories[random.nextInt(categories.length)]);
        
        // Random descriptions
        String[] descriptions = {
            "Grocery shopping",
            "Restaurant bill",
            "Online purchase",
            "Gas station",
            "Salary deposit",
            "Rent payment",
            "Utility bill",
            "Entertainment",
            "Medical expense",
            "Investment",
            "Insurance premium",
            "Internet bill",
            "Phone bill",
            "Travel expense",
            "Education fee"
        };
        transaction.setDescription(descriptions[random.nextInt(descriptions.length)]);
        
        // Random date within last 30 days
        transaction.setDate(LocalDateTime.now().minusDays(random.nextInt(30)));
        
        return transaction;
    }
    
    private SavingGoal createRandomSavingGoal(User user, int goalNum) {
        SavingGoal goal = new SavingGoal();
        goal.setUserId(user.getId());
        
        // Random target amount between $1,000 and $100,000
        double targetAmount = 1000 + (100000 - 1000) * random.nextDouble();
        goal.setTargetAmount(targetAmount);
        
        // Current amount is a percentage of target (0-80%)
        double currentAmount = targetAmount * (random.nextDouble() * 0.8);
        goal.setCurrentAmount(currentAmount);
        
        goal.setEditable(true);
        
        return goal;
    }
    
    private Loan createRandomLoan(User user, int loanNum) {
        Loan loan = new Loan();
        loan.setUserId(user.getId());
        
        // Random loan type
        String[] loanTypes = {"Home Loan", "Car Loan", "Personal Loan", "Education Loan", "Business Loan"};
        loan.setLoanType(loanTypes[random.nextInt(loanTypes.length)]);
        
        // Random total amount between $5,000 and $500,000
        double totalAmount = 5000 + (500000 - 5000) * random.nextDouble();
        loan.setTotalAmount(totalAmount);
        
        // EMI is roughly 1-3% of total amount per month
        double emiAmount = totalAmount * (0.01 + 0.02 * random.nextDouble()) / 12;
        loan.setEmiAmount(emiAmount);
        
        // Remaining amount is a percentage of total
        double remainingAmount = totalAmount * (0.2 + 0.8 * random.nextDouble());
        loan.setRemainingAmount(remainingAmount);
        
        return loan;
    }
    
    private User createUser(String fullName, String mobile, String email, String password) {
        User user = new User();
        user.setFullName(fullName);
        user.setMobile(mobile);
        user.setEmail(email);
        user.setPassword(password);
        user.setUsername(fullName.replace(" ", "_"));
        user.setCurrency("USD");
        user.setFingerprintEnabled(false);
        user.setIsProfileComplete(false);
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }
    
    @GetMapping("/api/health")
    public String health() {
        return "OK";
    }
}