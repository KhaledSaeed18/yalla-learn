// Types for expense tracking feature
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'MOBILE_PAYMENT' | 'SCHOLARSHIP' | 'OTHER';
export type Term = 'FALL' | 'SPRING' | 'SUMMER';

// Expense Category Type enum
export enum ExpenseCategoryType {
    HOUSING = 'HOUSING',
    FOOD = 'FOOD',
    TRANSPORTATION = 'TRANSPORTATION',
    EDUCATION = 'EDUCATION',
    ENTERTAINMENT = 'ENTERTAINMENT',
    HEALTHCARE = 'HEALTHCARE',
    CLOTHING = 'CLOTHING',
    UTILITIES = 'UTILITIES',
    SUBSCRIPTIONS = 'SUBSCRIPTIONS',
    SAVINGS = 'SAVINGS',
    PERSONAL_CARE = 'PERSONAL_CARE',
    GIFTS = 'GIFTS',
    TRAVEL = 'TRAVEL',
    TECH = 'TECH',
    INSURANCE = 'INSURANCE',
    OTHER = 'OTHER'
}