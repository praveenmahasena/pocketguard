import { Response} from "express";

import connection from "../../postgres/connect";
import {decodeJWT} from "../../utils/jwt";
import { ReqWithToken } from "../../types/types";

export default async function(req: ReqWithToken, res: Response) {

  try {
    const {pocketguard_token} = req.cookies
    const {userId} = decodeJWT(pocketguard_token, process.env.JWT_KEY as string)
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const currentMonthEnd = new Date();
    currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
    currentMonthEnd.setDate(0);
    currentMonthEnd.setHours(23, 59, 59, 999);

    const [balanceResult, monthlyExpensesResult, monthlyIncomeResult,
           expenseTrendsResult, categoryBreakdownResult,
           recentTransactionsResult] =
        await Promise.all([
          connection.query(`
        SELECT (
          (SELECT COALESCE(SUM(amount::numeric), 0) FROM income WHERE user_id = $1) -
          (SELECT COALESCE(SUM(amount::numeric), 0) FROM expenses WHERE user_id = $1)
        ) AS balance
      `,[ userId ]),

          connection.query(`
        SELECT COALESCE(SUM(amount::numeric), 0) AS total
        FROM expenses
        WHERE user_id = $1
        AND date BETWEEN $2 AND $3
      `,[ userId, currentMonthStart, currentMonthEnd ]),

          connection.query(`
        SELECT COALESCE(SUM(amount::numeric), 0) AS total
        FROM income
        WHERE user_id = $1
        AND date BETWEEN $2 AND $3
      `,[ userId, currentMonthStart, currentMonthEnd ]),

          connection.query(`
        SELECT
          to_char(date_trunc('month', date), 'Mon YYYY') AS month,
          SUM(amount::numeric) AS total
        FROM expenses
        WHERE user_id = $1
        AND date >= date_trunc('month', CURRENT_DATE - INTERVAL '5 months')
        GROUP BY month
        ORDER BY month
      `,[ userId ]),

          connection.query(`
        SELECT
          expense_type AS category,
          SUM(amount::numeric) AS total
        FROM expenses
        WHERE user_id = $1
        AND date >= date_trunc('month', CURRENT_DATE)
        GROUP BY expense_type
        ORDER BY total DESC
        LIMIT 6
      `,[ userId ]),

          connection.query(`
        (SELECT
          expense_id AS id,
          amount::numeric AS amount,
          place AS description,
          date,
          expense_type AS category,
          'expense' AS type
         FROM expenses
         WHERE user_id = $1
         ORDER BY date DESC, time DESC
         LIMIT 5)

        UNION ALL

        (SELECT
          income_id AS id,
          amount::numeric AS amount,
          source AS description,
          date,
          category,
          'income' AS type
         FROM income
         WHERE user_id = $1
         ORDER BY date DESC
         LIMIT 5)

        ORDER BY date DESC
        LIMIT 8
      `,[ userId ])
        ]);

    res.json({
      balance : parseFloat(balanceResult.rows[0].balance) || 0,
      monthlyExpenses : parseFloat(monthlyExpensesResult.rows[0].total) || 0,
      monthlyIncome : parseFloat(monthlyIncomeResult.rows[0].total) || 0,
      expenseTrends : expenseTrendsResult.rows,
      categoryBreakdown : categoryBreakdownResult.rows,
      recentTransactions : recentTransactionsResult.rows.map(
          txn => ({
            ...txn,
            amount : txn.type === 'expense' ? -parseFloat(txn.amount)
                                            : parseFloat(txn.amount),
            // For expenses, use place; for income, use source
            description : txn.type === 'expense'
                              ? txn.description
                              : `${txn.description} (${txn.category})`
          }))
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({error : 'Failed to load dashboard data'});
  }
}
