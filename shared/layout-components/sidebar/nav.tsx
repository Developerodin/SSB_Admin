import React from "react";

const UsersIcon = <i className="bx bx-user side-menu__icon"></i>;
const RewardsIcon = <i className="bx bx-gift side-menu__icon"></i>;
const TransactionsIcon = <i className="bx bx-transfer side-menu__icon"></i>;
const OrdersIcon = <i className="bx bx-cart side-menu__icon"></i>;
const CouponsIcon = <i className="bx bxs-coupon side-menu__icon"></i>;
const ChatIcon = <i className="bx bx-message-square-dots side-menu__icon"></i>;

export const MenuItems: any = [
  {
    menutitle: "MAIN",
  },
  {
    icon: UsersIcon,
    title: "All Users",
    type: "link",
    active: false,
    selected: false,
    path: "/tables/users",
  },
  {
    icon: ChatIcon,
    title: "Chat",
    type: "link",
    active: false,
    selected: false,
    path: "/tables/chat",
  },
  {
    icon: RewardsIcon,
    title: "Rewards & Pools",
    type: "link",
    active: false,
    selected: false,
    path: "/tables/rewards",
  },
  {
    icon: TransactionsIcon,
    title: "Transaction History",
    type: "link",
    active: false,
    selected: false,
    path: "/tables/transactions",
  },
  {
    icon: OrdersIcon,
    title: "All Orders",
    type: "link",
    active: false,
    selected: false,
    path: "/tables/orders",
  },
  {
    icon: CouponsIcon,
    title: "Discount Coupons",
    type: "link",
    active: false,
    selected: false,
    path: "/tables/coupons",
  },
];
