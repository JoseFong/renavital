import toast from "react-hot-toast"
import { ConfigurationCompleteInfo, RuleInfo } from "../types"

/////////////////////////////////////
//FUNCION ESQUELETO PARA VERITIFCAR REGLAS
/////////////////////////////////////

export function verifyProductRule(
    id: number,
    rules: RuleInfo[],
    selectedProducts: { id: number, categoryId: number, quantity: number }[],
    setSelectedProducts: any,
    configuration: ConfigurationCompleteInfo
) {
    const rulesToApply = rules.filter((r) => r.triggerType === "PRODUCT" && r.productSourceId === id)
    if (!rulesToApply || rulesToApply.length === 0) return

    //verificar si el producto esta o no seleccionado
    if (selectedProductsHasProduct(selectedProducts,id)) {

        //si esta seleccionado aplicamos las regla
        rulesToApply.map((r) => {
            if (r.type === "INCLUDES") {

                //agregar productos target
                r.ruleTargets.map((rt)=>{
                    //agregar un producto
                    addProduct(selectedProducts,rt.productId,configuration,setSelectedProducts)
                })

            }

            if (r.type === "EXCLUDES") {

                //quitar productos target

            }

            if (r.type === "SOME") {

                //informar el some

            }
        })

    } else {

        //si no esta seleccionado revertimos las reglas
        rulesToApply.map((r) => {
            if (r.type === "INCLUDES") {

                //quitar los productos target

            }
        })

    }
}

/////////////////////////////////////
//FUNCIONES AUXILIARES
/////////////////////////////////////

function selectedProductsHasProduct(
    selectedProducts:{id:number,categoryId:number,quantity:number}[],
    id:number
){  
    return selectedProducts.some((sp)=>sp.id===id)
}

function getFirstInstanceOfProduct(configuration:ConfigurationCompleteInfo,id:number){
    for(const cc of configuration.configurationCategories){
        const found = cc.category.productCategories.some((pc)=>
            pc.productId===id
        )

        if(found){
            return {
                id,
                categoryId: cc.categoryId
            }
        }
    }

    return {id:null,categoryId:null}
}

function addProduct(
    selectedProducts: { id: number, categoryId: number, quantity: number }[],
    productId:number,
    configuration: ConfigurationCompleteInfo,
    setSelectedProducts: any
) {    
    let aux = [...selectedProducts]  
    if(!selectedProductsHasProduct(selectedProducts,productId)){
        const {id,categoryId} = getFirstInstanceOfProduct(configuration,productId)
        if(!id || !categoryId) return
        aux.push({id:id,categoryId:categoryId,quantity:1})
    }
    setSelectedProducts(aux)
}
