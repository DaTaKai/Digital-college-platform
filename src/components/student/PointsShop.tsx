import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Coins,
  ShoppingCart,
  Gift,
  TrendingUp,
  Clock,
  CheckCircle,
  Package,
  Star,
} from "lucide-react";
import {
  getStudentPoints,
  getShopItemsByCategory,
  getStudentPurchases,
  SHOP_ITEMS,
} from "@/lib/data";
import { authService } from "@/lib/auth";

const PointsShop = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [purchaseDialog, setPurchaseDialog] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const user = authService.getCurrentUser();

  if (!user) return null;

  const studentPoints = getStudentPoints(user.id);
  const purchases = getStudentPurchases(user.id);

  const categories = [
    { id: "all", name: "Все товары", icon: ShoppingCart },
    { id: "clothing", name: "Одежда", icon: Package },
    { id: "accessories", name: "Аксессуары", icon: Gift },
    { id: "stationery", name: "Канцелярия", icon: Package },
    { id: "electronics", name: "Электроника", icon: Package },
  ];

  const handlePurchase = (item: any) => {
    if (!studentPoints || studentPoints.totalPoints < item.cost) {
      alert("Недостаточно баллов для покупки");
      return;
    }

    // Simulate purchase
    alert(
      `Покупка "${item.name}" успешно оформлена! Спишется ${item.cost} баллов.`,
    );
    setPurchaseDialog(false);
    setSelectedItem(null);
  };

  const getItemsByCategory = () => {
    return activeCategory === "all"
      ? SHOP_ITEMS
      : getShopItemsByCategory(activeCategory);
  };

  const canAfford = (cost: number) => {
    return studentPoints ? studentPoints.totalPoints >= cost : false;
  };

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Coins className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Всего баллов</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentPoints?.totalPoints || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Заработано сегодня</p>
                <p className="text-2xl font-bold text-gray-900">
                  +{studentPoints?.earnedToday || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Покупок</p>
                <p className="text-2xl font-bold text-gray-900">
                  {purchases.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="shop" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shop">Магазин</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="purchases">Покупки</TabsTrigger>
        </TabsList>

        <TabsContent value="shop" className="space-y-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Shop Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getItemsByCategory().map((item) => (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  !canAfford(item.cost) ? "opacity-60" : ""
                }`}
                onClick={() => {
                  setSelectedItem(item);
                  setPurchaseDialog(true);
                }}
              >
                <CardHeader className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      {item.popularity > 80 && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="h-3 w-3" />
                          Популярно
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{item.cost}</span>
                    </div>
                    {!item.inStock ? (
                      <Badge variant="destructive">Нет в наличии</Badge>
                    ) : canAfford(item.cost) ? (
                      <Badge variant="default">Можно купить</Badge>
                    ) : (
                      <Badge variant="outline">Недостаточно баллов</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>История заработка баллов</CardTitle>
            </CardHeader>
            <CardContent>
              {studentPoints?.history.length ? (
                <div className="space-y-3">
                  {studentPoints.history.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            transaction.type === "grade"
                              ? "bg-blue-100"
                              : transaction.type === "homework"
                                ? "bg-green-100"
                                : "bg-yellow-100"
                          }`}
                        >
                          {transaction.type === "grade" ? (
                            <Star className="h-4 w-4 text-blue-600" />
                          ) : transaction.type === "homework" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString(
                              "ru-RU",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <Coins className="h-4 w-4" />+{transaction.points}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Coins className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>История заработка баллов пуста</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Мои покупки</CardTitle>
            </CardHeader>
            <CardContent>
              {purchases.length ? (
                <div className="space-y-3">
                  {purchases.map((purchase) => {
                    const item = SHOP_ITEMS.find(
                      (i) => i.id === purchase.itemId,
                    );
                    return (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{item?.name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(purchase.date).toLocaleDateString(
                                "ru-RU",
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Coins className="h-4 w-4" />-{purchase.cost}
                          </div>
                          <Badge
                            variant={
                              purchase.status === "delivered"
                                ? "default"
                                : purchase.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {purchase.status === "delivered"
                              ? "Доставлено"
                              : purchase.status === "completed"
                                ? "Готово"
                                : "В обработке"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>У вас пока нет покупок</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialog} onOpenChange={setPurchaseDialog}>
        <DialogContent>
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  {selectedItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Стоимость:</span>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{selectedItem.cost}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>У вас баллов:</span>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">
                        {studentPoints?.totalPoints || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Останется:</span>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">
                        {(studentPoints?.totalPoints || 0) - selectedItem.cost}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setPurchaseDialog(false)}
                >
                  Отмена
                </Button>
                <Button
                  onClick={() => handlePurchase(selectedItem)}
                  disabled={
                    !canAfford(selectedItem.cost) || !selectedItem.inStock
                  }
                >
                  Купить
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PointsShop;
