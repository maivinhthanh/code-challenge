1. formattedBalances is unused
    this one created but never used, i think it need to use in rows

2. key of <WalletRow></WalletRow> need a id of balances from API or uuid() instead of index of array, because it can unnecessary re-renders and DOM inconsistencies

3. blockchain: any. It should defined a type for it instead of use any.

4. Dependency in useMemo is redundant. prices it not use in body of callback in useMemo

5. I think sortedBalances function is redundant. formattedBalances should use useMemo and the callback return balances.filter().sort().map()

6. blockchain in properties in balance but not declare in type WalletBalance

7. classes not declared

8. formattedBalances need declared type is FormattedWalletBalance


```
import { v4 as uuid } from 'uuid';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  uuid: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: string): number => {
    switch (blockchain) {
      case 'Osmosis': return 100;
      case 'Ethereum': return 50;
      case 'Arbitrum': return 30;
      case 'Zilliqa':
      case 'Neo': return 20;
      default: return -99;
    }
  };

  const formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return balances
      .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
        uuid: uuid(),
      }));
  }, [balances]);

  const rows = formattedBalances.map((balance) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        key={balance.uuid}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

```