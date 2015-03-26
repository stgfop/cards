'use strict';

angular.module('myApp.view1', ['ngRoute'])

        .config(['$routeProvider', function($routeProvider) {
                $routeProvider.when('/view1', {
                    templateUrl: 'view1/view1.html',
                    controller: 'View1Ctrl'
                });
            }])

        .controller('View1Ctrl', ['$scope', function($scope) {
                $scope.cards = [];
                $scope.setupCards = {};
                $scope.resources = {};
                $scope.cardTypes = {};
                $scope.effects = {};

                function init() {
                    var r = $scope.resources;
                    r.whea = createResource("blé", "wheat");
                    r.ston = createResource("ardoise", "stone");
                    r.gold = createResource("or", "gold");
                    r.wool = createResource("laine", "wool");
                    r.weap = createResource("fer", "iron");

                    var ct = $scope.cardTypes;
                    ct.pay = createCardType("paysan", "green");
                    ct.cle = createCardType("clergé", "purple");
                    ct.bou = createCardType("bourgeois", "gold");
                    ct.kni = createCardType("chevalier" ,"blue");
                    ct.nob = createCardType("noble", "red");

                    var e = $scope.effects;
                    e.none = createEffect("", "noeffect");
                    e.drawGold3 = createEffect("piochez 3 pieces", "drawGold3");
                    e.drawGold5 = createEffect("piochez 5 pieces", "drawGold5");
                    e.stealNear1 = createEffect("volez 1 piece à vos voisins", "stealNear1");
                    e.stealNear2 = createEffect("volez 2 pieces à vos voisins", "stealNear2");
                    e.stealRich1 = createEffect("volez 2 piece au plus riche", "stealRich1");
                    e.stealRich2 = createEffect("volez 3 pieces au plus riche", "stealRich2");
                    e.refundTrade1 = createEffect("récupérez une piece après un échange", "refundTrade1");
                    e.refundTrade2 = createEffect("récupérez jusqu'à 2 pieces après un échange", "refundTrade2");
                    e.skipTrade1 = createEffect("ne payez rien au premier douanier", "skipTrade1");
                    e.skipTrade2 = createEffect("ne payez rien au deux premier douaniers", "skipTrade2");
                    e.pp_pay = createEffect("1 points par Paysan", "pp");
                    e.pp_cle = createEffect("1 points par Prêtre", "pp");
                    e.pp_bou = createEffect("1 points par Bourgeois", "pp");
                    e.pp_kni = createEffect("1 points par Chevalier", "pp");
                    e.pp_nob = createEffect("1 points par Nobles", "pp");
                    e.cp_pay = createEffect("2 pieces par Paysan", "cp");
                    e.cp_cle = createEffect("2 pieces par Prêtre", "cp");
                    e.cp_bou = createEffect("2 pieces par Bourgeois", "cp");
                    e.cp_kni = createEffect("2 pieces par Chevalier", "cp");
                    e.cp_nob = createEffect("2 pieces par Nobles", "cp");
                    e.doubleType = createEffect("support compte double", "doubleType");

                    e.s_pParC = createEffect("1 point par carte", "s_pParC");
                    e.s_pSansC = createEffect("-1 point si pas carte", "s_pSansC");
                    e.s_pPlusC = createEffect("3 points majoritaire", "s_pPlusC");
                    e.s_pSiC = createEffect("2 points si carte", "s_pSiC");
                    e.s_pPiece = createEffect("1 points pour 3 pieces", "s_pPiece");
                    e.s_pCarteDiff = createEffect("1 points par carte differente", "s_pCarteDiff");

                    initSetupCards(ct, e);
                    initCards(r, ct, e);
                }

                function initCards(r, ct, e) {
                    initCardsBase(e, r.whea, ct.pay, e.pp_kni, ct.kni, e.cp_cle, ct.cle);
                    initCardsBase(e, r.wool, ct.cle, e.pp_nob, ct.nob, e.cp_bou, ct.bou);
                    initCardsBase(e, r.gold, ct.bou, e.pp_pay, ct.pay, e.cp_kni, ct.kni);
                    initCardsBase(e, r.weap, ct.kni, e.pp_cle, ct.cle, e.cp_nob, ct.nob);
                    initCardsBase(e, r.ston, ct.nob, e.pp_bou, ct.bou, e.cp_pay, ct.pay);

                    createPlayCard(r.whea, ct.bou, "", 1, 1, e.drawGold3);
                    createPlayCard(r.whea, ct.nob, "", 2, 1, e.drawGold5);

                    createPlayCard(r.wool, ct.kni, "", 1, 1, e.stealRich1);
                    createPlayCard(r.wool, ct.pay, "", 2, 1, e.stealRich2);

                    createPlayCard(r.gold, ct.nob, "", 1, 1, e.skipTrade1);
                    createPlayCard(r.gold, ct.cle, "", 2, 1, e.skipTrade2);

                    createPlayCard(r.weap, ct.pay, "", 1, 1, e.stealNear1);
                    createPlayCard(r.weap, ct.bou, "", 2, 1, e.stealNear2);

                    createPlayCard(r.ston, ct.cle, "", 1, 1, e.refundTrade1);
                    createPlayCard(r.ston, ct.kni, "", 2, 1, e.refundTrade2);

                }

                function initCardsBase(e, resource, type, pointEffect, pointType, coinEffect, cointType) {
                    createPlayCard(resource, type, "cabane", 0, 1, e.none);
                    createPlayCard(resource, type, "maison", 0, 1, e.none);
                    createPlayCard(resource, type, "villa", 1, 2, e.none);
                    createPlayCard(resource, type, "moulin", 2, 1, e.doubleType);
                    createPlayCard(resource, pointType, "fortification", 3, 0, pointEffect);
                    createPlayCard(resource, cointType, "chateau", 3, 0, coinEffect);
                }

                function initSetupCards(ct, e) {
                    $scope.setupCards.pay = [createSetupCard(ct.pay, "Paysans", e.s_pPlusC)];
                    $scope.setupCards.cle = [createSetupCard(ct.cle, "Prêtres", e.s_pPlusC)];
                    $scope.setupCards.bou = [createSetupCard(ct.bou, "Bourgeois", e.s_pPlusC)];
                    $scope.setupCards.kni = [createSetupCard(ct.kni, "Chevaliers", e.s_pPlusC)];
                    $scope.setupCards.nob = [createSetupCard(ct.nob, "Nobles", e.s_pPlusC)];

                    $scope.setupCards.pay.push(createSetupCard(ct.pay, "Paysans", e.s_pParC));
                    $scope.setupCards.bou.push(createSetupCard(ct.bou, "Bourgeois", e.s_pParC));

                    $scope.setupCards.pay.push(createSetupCard(ct.pay, "Paysans", e.s_pSansC));
                    $scope.setupCards.cle.push(createSetupCard(ct.cle, "Prêtres", e.s_pSansC));

                    $scope.setupCards.bou.push(createSetupCard(ct.bou, "Bourgeois", e.s_pPiece));
                    $scope.setupCards.nob.push(createSetupCard(ct.nob, "Nobles", e.s_pPiece));

                    $scope.setupCards.cle.push(createSetupCard(ct.cle, "Prêtres", e.s_pSiC));
                    $scope.setupCards.kni.push(createSetupCard(ct.kni, "Chevaliers", e.s_pSiC));

                    $scope.setupCards.kni.push(createSetupCard(ct.kni, "Chevaliers", e.s_pCarteDiff));
                    $scope.setupCards.nob.push(createSetupCard(ct.nob, "Nobles", e.s_pCarteDiff));

                }

                function createResource(name, img) {
                    return {
                        name: name,
                        img: img
                    }
                }

                function createCardType(name, color) {
                    return {
                        name: name,
                        color: color
                    }
                }

                function createEffect(name, img) {
                    return {
                        name: name,
                        img: img
                    }
                }

                function createPlayCard(resource, type, name, price, points, effect) {
                    $scope.cards.push({
                        resource: resource,
                        name: name,
                        type: type,
                        price: price,
                        points: points,
                        effect: effect
                    });
                }

                function createSetupCard(type, name, effect) {
                    return {
                        name: name,
                        type: type,
                        effect: effect
                    };
                }

                init();

            }]);